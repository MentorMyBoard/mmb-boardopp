const path = require('path');
const crypto = require('crypto');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const { initDb, getDb } = require('./db');
const { sendDirectorConfirmation, sendCompanyConfirmation } = require('./email');
const { createZohoLead } = require('./zoho');
const { syncGmailAlerts } = require('./gmail-boards');
const { fetchArticleContent } = require('./content-fetch');

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

// ── Board Updates — Public ─────────────────────────────────────────────────

app.get('/api/board-updates', (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 12);
    const offset = (page - 1) * limit;
    const category = req.query.category && req.query.category !== 'all' ? req.query.category : null;
    const search = req.query.search ? `%${req.query.search}%` : null;

    let where = "WHERE status = 'approved'";
    const params = [];
    if (category) { where += ' AND category = ?'; params.push(category); }
    if (search) { where += ' AND (headline LIKE ? OR source_name LIKE ? OR description LIKE ?)'; params.push(search, search, search); }

    const total = getDb().prepare(`SELECT COUNT(*) as cnt FROM board_updates ${where}`).get(...params).cnt;
    const rows = getDb().prepare(
      `SELECT id, headline, source_name, article_url, published_date, description, image_url, category
       FROM board_updates ${where}
       ORDER BY published_date DESC, created_at DESC
       LIMIT ? OFFSET ?`
    ).all(...params, limit, offset);

    res.json({ data: rows, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('[BoardUpdates] GET error:', err);
    res.status(500).json({ error: 'Failed to fetch board updates' });
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

// ── BoardWatch Analytics Tracking ─────────────────────────────────────────

function hashIp(ip) {
  const salt = new Date().toISOString().slice(0, 10); // daily rotation — anonymous
  return crypto.createHash('sha256').update(ip + salt + 'bw').digest('hex').slice(0, 16);
}

app.post('/api/board-updates/track', (req, res) => {
  try {
    const { event_type, article_id, article_headline, session_id, referrer } = req.body;
    if (!['page_view', 'article_open'].includes(event_type)) {
      return res.status(400).json({ error: 'Invalid event_type' });
    }
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || '';
    const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    getDb().prepare(`
      INSERT INTO boardwatch_views (id, event_type, article_id, article_headline, ip_hash, user_agent, referrer, session_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, event_type, article_id || null, (article_headline || '').slice(0, 300), hashIp(ip), (req.headers['user-agent'] || '').slice(0, 200), (referrer || '').slice(0, 300), (session_id || '').slice(0, 40), new Date().toISOString());
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Tracking error' });
  }
});

app.get('/api/admin/board-updates/analytics', adminGuard, (req, res) => {
  try {
    const db = getDb();
    const now = new Date();
    const todayStr  = now.toISOString().slice(0, 10);
    const ago7d     = new Date(now - 7  * 86400000).toISOString();
    const ago14d    = new Date(now - 14 * 86400000).toISOString();
    const ago30d    = new Date(now - 30 * 86400000).toISOString();

    const totalViews   = db.prepare("SELECT COUNT(*) c FROM boardwatch_views WHERE event_type='page_view'").get().c;
    const totalOpens   = db.prepare("SELECT COUNT(*) c FROM boardwatch_views WHERE event_type='article_open'").get().c;
    const todayViews   = db.prepare("SELECT COUNT(*) c FROM boardwatch_views WHERE event_type='page_view' AND created_at>=?").get(todayStr + 'T00:00:00').c;
    const sessions7d   = db.prepare("SELECT COUNT(DISTINCT session_id) c FROM boardwatch_views WHERE created_at>=? AND session_id!=''").get(ago7d).c;
    const totalSessions= db.prepare("SELECT COUNT(DISTINCT session_id) c FROM boardwatch_views WHERE session_id!=''").get().c;

    const daily = db.prepare(`
      SELECT substr(created_at,1,10) date,
        SUM(CASE WHEN event_type='page_view'   THEN 1 ELSE 0 END) views,
        SUM(CASE WHEN event_type='article_open' THEN 1 ELSE 0 END) opens
      FROM boardwatch_views WHERE created_at>=? GROUP BY date ORDER BY date ASC
    `).all(ago14d);

    const topArticles = db.prepare(`
      SELECT article_id, article_headline, COUNT(*) opens
      FROM boardwatch_views
      WHERE event_type='article_open' AND article_id IS NOT NULL
      GROUP BY article_id ORDER BY opens DESC LIMIT 10
    `).all();

    const recent = db.prepare(`
      SELECT event_type, article_headline, session_id, referrer, created_at
      FROM boardwatch_views ORDER BY created_at DESC LIMIT 60
    `).all();

    res.json({ stats: { totalViews, totalOpens, todayViews, sessions7d, totalSessions }, daily, topArticles, recent });
  } catch (err) {
    console.error('[Analytics] Error:', err.message);
    res.status(500).json({ error: 'Analytics failed', detail: err.message });
  }
});

// ── Article content proxy — check DB first, paraphrase once, store permanently
app.get('/api/board-updates/content', async (req, res) => {
  const url = req.query.url;
  const id  = req.query.id;

  // Serve from DB if already paraphrased
  if (id) {
    const row = getDb().prepare('SELECT paraphrased_content, image_url FROM board_updates WHERE id = ?').get(id);
    if (row && row.paraphrased_content) {
      return res.json({ content: row.paraphrased_content, ogImage: row.image_url || '', ogTitle: '', ogDescription: '' });
    }
  }

  if (!url) {
    // id was provided but no stored paraphrase, and no URL to fetch — return empty gracefully
    if (id) return res.json({ content: '', ogImage: '', ogTitle: '', ogDescription: '' });
    return res.status(400).json({ error: 'url parameter required' });
  }

  try {
    const data = await fetchArticleContent(url);

    // Save paraphrased content permanently so this article is never re-paraphrased
    if (id && data.content) {
      getDb().prepare('UPDATE board_updates SET paraphrased_content = ? WHERE id = ?').run(data.content, id);
      if (data.ogImage) {
        // Fill image_url if blank
        getDb().prepare("UPDATE board_updates SET image_url = ? WHERE id = ? AND (image_url IS NULL OR image_url = '')").run(data.ogImage, id);
      }
      console.log(`[ContentFetch] Paraphrased & stored article ${id}`);
    }

    res.json(data);
  } catch (err) {
    console.error('[ContentFetch] Error for', url, '—', err.message);
    res.status(500).json({ error: 'Could not fetch article content', detail: err.message });
  }
});

// ── Board Updates — Admin ──────────────────────────────────────────────────

app.get('/api/admin/board-updates', adminGuard, (req, res) => {
  try {
    const status = req.query.status && req.query.status !== 'all' ? req.query.status : null;
    let where = status ? 'WHERE status = ?' : '';
    const params = status ? [status] : [];
    const rows = getDb().prepare(
      `SELECT * FROM board_updates ${where} ORDER BY created_at DESC`
    ).all(...params);
    const counts = getDb().prepare(
      "SELECT status, COUNT(*) as cnt FROM board_updates GROUP BY status"
    ).all();
    const countMap = Object.fromEntries(counts.map((r) => [r.status, r.cnt]));
    res.json({ data: rows, counts: countMap });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch board updates' });
  }
});

app.post('/api/admin/board-updates', adminGuard, (req, res) => {
  try {
    const { headline, source_name, article_url, published_date, description, image_url, category, status } = req.body;
    if (!headline) return res.status(400).json({ error: 'headline is required' });

    const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    const now = new Date().toISOString();

    getDb().prepare(`
      INSERT INTO board_updates
        (id, headline, source_name, article_url, published_date, description, image_url, category, status, gmail_message_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '', ?, ?)
    `).run(
      id, headline, source_name || '', article_url,
      published_date || now, description || '', image_url || '',
      category || 'Board News', status || 'approved', now, now
    );

    const row = getDb().prepare('SELECT * FROM board_updates WHERE id = ?').get(id);
    res.json({ success: true, data: row });
  } catch (err) {
    if (err.message.includes('UNIQUE')) return res.status(409).json({ error: 'Article with this URL already exists' });
    res.status(500).json({ error: 'Failed to create article' });
  }
});

app.put('/api/admin/board-updates/:id', adminGuard, (req, res) => {
  try {
    const { headline, source_name, article_url, published_date, description, image_url, category, status } = req.body;
    const now = new Date().toISOString();

    // If URL is being removed and content was never stored, fetch + save it in the background
    // so the article keeps its full content and thumbnail even after the URL is cleared
    if (!article_url) {
      const cur = getDb().prepare('SELECT article_url, paraphrased_content FROM board_updates WHERE id = ?').get(req.params.id);
      if (cur?.article_url && !cur?.paraphrased_content) {
        fetchArticleContent(cur.article_url)
          .then((data) => {
            if (data.content) getDb().prepare('UPDATE board_updates SET paraphrased_content = ? WHERE id = ?').run(data.content, req.params.id);
            if (data.ogImage) getDb().prepare("UPDATE board_updates SET image_url = ? WHERE id = ? AND (image_url IS NULL OR image_url = '')").run(data.ogImage, req.params.id);
          })
          .catch((e) => console.error('[BoardUpdates] Background content store failed:', e.message));
      }
    }

    getDb().prepare(`
      UPDATE board_updates
      SET headline=?, source_name=?, article_url=?, published_date=?, description=?,
          image_url=?, category=?, status=?, updated_at=?
      WHERE id=?
    `).run(
      headline, source_name, article_url, published_date, description,
      image_url ?? '', category, status, now, req.params.id
    );

    const row = getDb().prepare('SELECT * FROM board_updates WHERE id = ?').get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, data: row });
  } catch (err) {
    console.error('[BoardUpdates] PUT error:', err.message);
    if (err.message.includes('UNIQUE')) return res.status(409).json({ error: 'Another article already has this URL' });
    res.status(500).json({ error: 'Failed to update article', detail: err.message });
  }
});

app.patch('/api/admin/board-updates/:id/status', adminGuard, (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'hidden'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const now = new Date().toISOString();
    getDb().prepare('UPDATE board_updates SET status=?, updated_at=? WHERE id=?').run(status, now, req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

app.delete('/api/admin/board-updates/:id', adminGuard, (req, res) => {
  getDb().prepare('DELETE FROM board_updates WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.post('/api/admin/board-updates/reset-sync-log', adminGuard, (req, res) => {
  getDb().prepare('DELETE FROM gmail_sync_log').run();
  res.json({ success: true, message: 'Sync log cleared — next sync will reprocess all emails' });
});

app.post('/api/admin/board-updates/sync', adminGuard, async (req, res) => {
  try {
    const result = await syncGmailAlerts(getDb());
    res.json({ success: true, ...result });
  } catch (err) {
    console.error('[Gmail Sync] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/admin/board-updates/debug-email', adminGuard, async (req, res) => {
  try {
    const { getAccessToken, getLabelId, listMessages, getMessage, getEmailBody, getHeader } = require('./gmail-boards');
    const token = await getAccessToken();
    const labelName = process.env.GMAIL_LABEL_NAME || 'BoardUpdates';
    const labelId = await getLabelId(token, labelName);
    const messages = await listMessages(token, labelId, 3);
    if (!messages.length) return res.json({ error: 'No messages found' });
    const msg = await getMessage(token, messages[0].id);
    const subject = getHeader(msg, 'subject');
    const html = getEmailBody(msg);
    res.json({
      messageId: messages[0].id,
      subject,
      htmlLength: html?.length || 0,
      htmlPreview: html?.slice(0, 3000) || null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/board-updates/sync-status', adminGuard, (req, res) => {
  try {
    const last = getDb().prepare('SELECT * FROM gmail_sync_log ORDER BY synced_at DESC LIMIT 1').get();
    const total = getDb().prepare('SELECT COUNT(*) as cnt FROM gmail_sync_log').get().cnt;
    res.json({ lastSync: last || null, totalEmailsProcessed: total });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get sync status' });
  }
});

// ── Promotional Popups ─────────────────────────────────────────────────────

app.get('/api/popups', (_req, res) => {
  try {
    const rows = getDb().prepare('SELECT * FROM promotional_popups WHERE is_active = 1 ORDER BY created_at DESC').all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/popups', adminGuard, (_req, res) => {
  try {
    const rows = getDb().prepare('SELECT * FROM promotional_popups ORDER BY created_at DESC').all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/popups', adminGuard, (req, res) => {
  try {
    const { title, image_url, orientation, image_width, image_height, button_text, button_url, position, is_active } = req.body;
    if (!title || !image_url) return res.status(400).json({ error: 'title and image_url are required' });
    const id = uid();
    const now = new Date().toISOString();
    getDb().prepare(`
      INSERT INTO promotional_popups (id, title, image_url, orientation, image_width, image_height, button_text, button_url, position, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, title, image_url, orientation || 'landscape', image_width || 400, image_height || 300, button_text || '', button_url || '', position || 'right-bottom', is_active !== false ? 1 : 0, now, now);
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/popups/:id', adminGuard, (req, res) => {
  try {
    const { title, image_url, orientation, image_width, image_height, button_text, button_url, position, is_active } = req.body;
    const now = new Date().toISOString();
    getDb().prepare(`
      UPDATE promotional_popups SET title=?, image_url=?, orientation=?, image_width=?, image_height=?, button_text=?, button_url=?, position=?, is_active=?, updated_at=? WHERE id=?
    `).run(title, image_url, orientation || 'landscape', image_width || 400, image_height || 300, button_text || '', button_url || '', position || 'right-bottom', is_active ? 1 : 0, now, req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/popups/:id', adminGuard, (req, res) => {
  try {
    getDb().prepare('DELETE FROM promotional_popups WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
