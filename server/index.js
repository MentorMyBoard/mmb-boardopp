require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDb, getDb } = require('./db');
const { sendDirectorConfirmation, sendCompanyConfirmation } = require('./email');
const { createZohoLead } = require('./zoho');

const app = express();
const PORT = process.env.PORT || 3001;
const IS_PROD = process.env.NODE_ENV === 'production';

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({
  origin: IS_PROD
    ? ['https://boardopp.mentormyboard.com']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));

// Request logger
app.use((req, _res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

// Init DB
initDb();

// ── Helpers ────────────────────────────────────────────────────────────────
function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function adminGuard(req, res, next) {
  const token = req.headers['x-admin-token'] || req.query.token;
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// ── Public Routes ──────────────────────────────────────────────────────────

// Director registration
app.post('/api/director', async (req, res) => {
  try {
    const data = req.body;

    if (!data.name || !data.email) {
      return res.status(400).json({ success: false, error: 'Name and email are required' });
    }

    const id = uid();
    const submittedAt = new Date().toISOString();

    getDb().prepare(`
      INSERT INTO directors
        (id, name, email, phone, designation, industry, experience,
         board_experience, linkedin, expertise, preferred_role, location,
         resume_name, submitted_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, data.name, data.email, data.phone || '',
      data.designation || '', data.industry || '', data.experience || '',
      data.boardExperience || '', data.linkedin || '',
      JSON.stringify(data.expertise || []),
      data.preferredRole || '', data.location || '',
      data.resumeName || '', submittedAt
    );

    // Fire-and-forget — don't let email/CRM failure block the response
    sendDirectorConfirmation(data).catch((err) =>
      console.error('[Email] Director confirmation failed:', err.message)
    );
    createZohoLead({ type: 'director', ...data }).catch((err) =>
      console.error('[Zoho] Director lead failed:', err.message)
    );

    console.log(`[Director] Registered: ${data.name} <${data.email}>`);
    res.json({ success: true, id });
  } catch (err) {
    console.error('[Director] Error:', err);
    res.status(500).json({ success: false, error: 'Registration failed. Please try again.' });
  }
});

// Company registration
app.post('/api/company', async (req, res) => {
  try {
    const data = req.body;

    if (!data.companyName || !data.email) {
      return res.status(400).json({ success: false, error: 'Company name and email are required' });
    }

    const id = uid();
    const submittedAt = new Date().toISOString();

    getDb().prepare(`
      INSERT INTO companies
        (id, company_name, industry, company_size, website, contact_person,
         designation, email, phone, requirement_types, additional_details, submitted_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, data.companyName, data.industry || '', data.companySize || '',
      data.website || '', data.contactPerson || '', data.designation || '',
      data.email, data.phone || '',
      JSON.stringify(data.requirementTypes || []),
      data.additionalDetails || '', submittedAt
    );

    sendCompanyConfirmation(data).catch((err) =>
      console.error('[Email] Company confirmation failed:', err.message)
    );
    createZohoLead({ type: 'company', ...data }).catch((err) =>
      console.error('[Zoho] Company lead failed:', err.message)
    );

    console.log(`[Company] Registered: ${data.companyName} — ${data.contactPerson} <${data.email}>`);
    res.json({ success: true, id });
  } catch (err) {
    console.error('[Company] Error:', err);
    res.status(500).json({ success: false, error: 'Registration failed. Please try again.' });
  }
});

// ── Admin Routes (protected) ───────────────────────────────────────────────

app.get('/api/admin/directors', adminGuard, (req, res) => {
  try {
    const rows = getDb().prepare('SELECT * FROM directors ORDER BY submitted_at DESC').all();
    const data = rows.map((r) => ({
      ...r,
      expertise: JSON.parse(r.expertise || '[]'),
    }));
    res.json({ data, total: data.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch directors' });
  }
});

app.get('/api/admin/companies', adminGuard, (req, res) => {
  try {
    const rows = getDb().prepare('SELECT * FROM companies ORDER BY submitted_at DESC').all();
    const data = rows.map((r) => ({
      ...r,
      requirementTypes: JSON.parse(r.requirement_types || '[]'),
    }));
    res.json({ data, total: data.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

app.delete('/api/admin/directors/:id', adminGuard, (req, res) => {
  getDb().prepare('DELETE FROM directors WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.delete('/api/admin/companies/:id', adminGuard, (req, res) => {
  getDb().prepare('DELETE FROM companies WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ── Health check ───────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV, timestamp: new Date().toISOString() });
});

// ── Serve React build in production ───────────────────────────────────────
if (IS_PROD) {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`\n🚀  BoardOpp server running at http://localhost:${PORT}`);
  console.log(`   Mode: ${IS_PROD ? 'production' : 'development'}`);
  if (!IS_PROD) {
    console.log(`   Frontend: http://localhost:5173`);
  }
  console.log('');
});
