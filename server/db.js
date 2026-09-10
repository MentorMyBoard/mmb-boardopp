const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'boardopp.db');
let db;

function initDb() {
  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS boardwatch_views (
      id               TEXT PRIMARY KEY,
      event_type       TEXT NOT NULL,
      article_id       TEXT,
      article_headline TEXT,
      ip_hash          TEXT,
      user_agent       TEXT,
      referrer         TEXT,
      session_id       TEXT,
      created_at       TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_bwv_event  ON boardwatch_views(event_type);
    CREATE INDEX IF NOT EXISTS idx_bwv_date   ON boardwatch_views(created_at);
    CREATE INDEX IF NOT EXISTS idx_bwv_art    ON boardwatch_views(article_id);

    CREATE TABLE IF NOT EXISTS board_updates (
      id               TEXT PRIMARY KEY,
      headline         TEXT NOT NULL,
      source_name      TEXT,
      article_url      TEXT NOT NULL,
      published_date   TEXT,
      description      TEXT,
      image_url        TEXT,
      category         TEXT DEFAULT 'Board Appointment',
      status           TEXT DEFAULT 'pending',
      gmail_message_id TEXT,
      created_at       TEXT NOT NULL,
      updated_at       TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS gmail_sync_log (
      id               TEXT PRIMARY KEY,
      gmail_message_id TEXT UNIQUE NOT NULL,
      subject          TEXT,
      articles_parsed  INTEGER DEFAULT 0,
      synced_at        TEXT NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS idx_board_updates_url
      ON board_updates(article_url);
    CREATE INDEX IF NOT EXISTS idx_board_updates_status
      ON board_updates(status);
    CREATE INDEX IF NOT EXISTS idx_board_updates_date
      ON board_updates(published_date);

    CREATE TABLE IF NOT EXISTS directors (
      id            TEXT PRIMARY KEY,
      name          TEXT NOT NULL,
      email         TEXT NOT NULL,
      phone         TEXT,
      designation   TEXT,
      industry      TEXT,
      experience    TEXT,
      board_experience TEXT,
      linkedin      TEXT,
      expertise     TEXT,
      preferred_role TEXT,
      location      TEXT,
      resume_name   TEXT,
      submitted_at  TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS companies (
      id                  TEXT PRIMARY KEY,
      company_name        TEXT NOT NULL,
      industry            TEXT,
      company_size        TEXT,
      website             TEXT,
      contact_person      TEXT,
      designation         TEXT,
      email               TEXT NOT NULL,
      phone               TEXT,
      requirement_types   TEXT,
      additional_details  TEXT,
      submitted_at        TEXT NOT NULL
    );
  `);

  // Settings table — stores rotating credentials and config
  db.exec(`
    CREATE TABLE IF NOT EXISTS app_settings (
      key        TEXT PRIMARY KEY,
      value      TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // Safe schema migrations — silently skip if already applied
  db.exec(`
    CREATE TABLE IF NOT EXISTS promotional_popups (
      id           TEXT PRIMARY KEY,
      title        TEXT NOT NULL,
      image_url    TEXT NOT NULL,
      orientation  TEXT DEFAULT 'landscape',
      image_width  INTEGER DEFAULT 400,
      image_height INTEGER DEFAULT 300,
      button_text  TEXT DEFAULT '',
      button_url   TEXT DEFAULT '',
      position     TEXT DEFAULT 'right-bottom',
      is_active    INTEGER DEFAULT 1,
      created_at   TEXT NOT NULL,
      updated_at   TEXT NOT NULL
    );
  `);

  const migrations = [
    'ALTER TABLE board_updates ADD COLUMN paraphrased_content TEXT',
    // Allow multiple articles with empty/null URL — only enforce uniqueness for real URLs
    'DROP INDEX IF EXISTS idx_board_updates_url',
    "CREATE UNIQUE INDEX IF NOT EXISTS idx_board_updates_url ON board_updates(article_url) WHERE article_url != '' AND article_url IS NOT NULL",
  ];
  for (const sql of migrations) {
    try { db.exec(sql); } catch {}
  }

  // ── Site content (assessments, partners, testimonials, community, settings) ──
  db.exec(`
    CREATE TABLE IF NOT EXISTS assessments (
      id           TEXT PRIMARY KEY,
      name         TEXT NOT NULL,
      description  TEXT,
      button_text  TEXT,
      url          TEXT,
      icon         TEXT,
      order_num    INTEGER DEFAULT 1,
      active       INTEGER DEFAULT 1,
      created_at   TEXT NOT NULL,
      updated_at   TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS partners (
      id           TEXT PRIMARY KEY,
      name         TEXT NOT NULL,
      logo         TEXT,
      website      TEXT,
      order_num    INTEGER DEFAULT 1,
      active       INTEGER DEFAULT 1,
      created_at   TEXT NOT NULL,
      updated_at   TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id           TEXT PRIMARY KEY,
      name         TEXT NOT NULL,
      designation  TEXT,
      organization TEXT,
      photo        TEXT,
      text         TEXT,
      video_link   TEXT,
      order_num    INTEGER DEFAULT 1,
      active       INTEGER DEFAULT 1,
      created_at   TEXT NOT NULL,
      updated_at   TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS community_members (
      id           TEXT PRIMARY KEY,
      name         TEXT NOT NULL,
      photo        TEXT,
      designation  TEXT,
      industry     TEXT,
      experience   TEXT,
      expertise    TEXT DEFAULT '[]',
      badges       TEXT DEFAULT '[]',
      linkedin     TEXT,
      order_num    INTEGER DEFAULT 1,
      active       INTEGER DEFAULT 1,
      created_at   TEXT NOT NULL,
      updated_at   TEXT NOT NULL
    );
  `);

  seedContentTables(db);

  console.log('[DB] Initialized at', DB_PATH);
  return db;
}

// One-time seed so the live site isn't blank on first boot — matches the
// original hardcoded defaults from the pre-migration localStorage version.
function seedContentTables(db) {
  const now = new Date().toISOString();

  const assessmentCount = db.prepare('SELECT COUNT(*) c FROM assessments').get().c;
  if (assessmentCount === 0) {
    const defaults = [
      { id: 'a1', name: 'Director Readiness Assessment', description: 'Discover your readiness to serve on a corporate board', button_text: 'Take Assessment', url: '#', icon: '🏛', order_num: 1 },
      { id: 'a2', name: 'Board Effectiveness Review', description: 'Benchmark your board against global governance standards', button_text: 'Begin Review', url: '#', icon: '📊', order_num: 2 },
      { id: 'a3', name: 'ESG Governance Maturity', description: "Assess your organization's ESG governance readiness", button_text: 'Assess Now', url: '#', icon: '🌿', order_num: 3 },
      { id: 'a4', name: 'Audit Committee Readiness', description: 'Evaluate your preparedness for audit committee leadership', button_text: 'Start Assessment', url: '#', icon: '⚖', order_num: 4 },
    ];
    const stmt = db.prepare(`INSERT INTO assessments (id, name, description, button_text, url, icon, order_num, active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`);
    for (const a of defaults) stmt.run(a.id, a.name, a.description, a.button_text, a.url, a.icon, a.order_num, now, now);
  }

  const partnerCount = db.prepare('SELECT COUNT(*) c FROM partners').get().c;
  if (partnerCount === 0) {
    const names = ['I-Spark', 'PROCS', 'Pantomath', 'Pillai', 'Share India', 'RTP', 'Equations', 'Sepentia', 'BA', 'Relligio', 'Optimist', 'Mentor', 'ILA', 'Zenesse', 'Impact', 'Shunya', 'P4G', 'Samsara', 'Amazin', 'TerraPledge', 'Legal', 'Ouriken', 'Rhyyns', 'Cloud', 'ESG', 'Prudent', 'MG', 'Mentor Finance'];
    const stmt = db.prepare(`INSERT INTO partners (id, name, logo, website, order_num, active, created_at, updated_at) VALUES (?, ?, ?, '#', ?, 1, ?, ?)`);
    names.forEach((name, i) => {
      const slug = name.toLowerCase().replace(/\s+/g, '-');
      stmt.run(`p${i + 1}`, name, `/partners/${slug}.jpg`, i + 1, now, now);
    });
  }

  const testimonialCount = db.prepare('SELECT COUNT(*) c FROM testimonials').get().c;
  if (testimonialCount === 0) {
    const defaults = [
      { id: 't1', name: 'Deepak Srivastava', designation: 'Independent Director', organization: 'A Renowned Energy Conglomerate', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format', text: 'BoardOpp is not a platform — it is a governance movement. It has fundamentally changed how India\'s most accomplished professionals think about board service.', order_num: 1 },
      { id: 't2', name: 'Ananya Krishnaswamy', designation: 'Chief Governance Officer', organization: 'A Renowned IT & BPM Company', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&auto=format', text: 'We found our entire audit committee through BoardOpp in record time. The quality of professionals on this platform is unmatched. A true governance ecosystem.', order_num: 2 },
      { id: 't3', name: 'Rajan Pillai', designation: 'Former CMD', organization: 'Renowned Public Sector Bank', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format', text: 'The Director Readiness Assessment gave me a clear-eyed view of where I stood and what I needed to develop before taking on an independent director role. Invaluable.', order_num: 3 },
    ];
    const stmt = db.prepare(`INSERT INTO testimonials (id, name, designation, organization, photo, text, video_link, order_num, active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, '', ?, 1, ?, ?)`);
    for (const t of defaults) stmt.run(t.id, t.name, t.designation, t.organization, t.photo, t.text, t.order_num, now, now);
  }

  const communityCount = db.prepare('SELECT COUNT(*) c FROM community_members').get().c;
  if (communityCount === 0) {
    const defaults = [
      { id: 'c1', name: 'Namrata Thakkar', photo: '/board-placement/namrata-thakkar.png', designation: 'Independent Director at Arihant Superstructures Ltd.', industry: 'Real Estate', expertise: ['Corporate Governance', 'Real Estate', 'Board Affairs'], badges: ['Independent Director'] },
      { id: 'c2', name: 'Nalina Suresh', photo: '/board-placement/nalina-suresh.png', designation: 'Independent Director, Founder – Stratus Talent', industry: 'HR & Talent', expertise: ['Talent Strategy', 'Corporate Governance', 'Leadership'], badges: ['Independent Director'] },
      { id: 'c3', name: 'Ranjeeta Sahoo', photo: '/board-placement/ranjeeta-saahu.png', designation: 'Independent Director, Principal – Abode School', industry: 'Education', expertise: ['Education', 'Corporate Governance', 'Stakeholder Management'], badges: ['Independent Director'] },
      { id: 'c4', name: 'Sonal Doshi', photo: '/board-placement/sonal-doshi.png', designation: 'Independent Director at MCON Rasayan India Ltd.', industry: 'Manufacturing', expertise: ['Corporate Governance', 'Manufacturing', 'Compliance'], badges: ['Independent Director'] },
      { id: 'c5', name: 'Dilip Jain', photo: '/board-placement/dilip-jain.png', designation: 'Independent Director at MCON Rasayan India Ltd.', industry: 'Manufacturing', expertise: ['Corporate Governance', 'Finance', 'Risk Management'], badges: ['Independent Director'] },
      { id: 'c6', name: 'Shilpa Bhatia', photo: '/board-placement/shilpa-bhatia.png', designation: 'Independent Director at Coastal Marine Construction & Engineering Ltd.', industry: 'Infrastructure', expertise: ['Corporate Governance', 'Infrastructure', 'Legal'], badges: ['Independent Director'] },
      { id: 'c7', name: 'Rear Admiral Sanjay Roye', photo: '/board-placement/rear-admiral-sanjay-roye.png', designation: 'Independent Director, Sacheerome Ltd.', industry: 'Infrastructure', expertise: ['Strategic Leadership', 'Defence', 'Corporate Governance'], badges: ['Independent Director'] },
      { id: 'c8', name: 'Capt Tapas Majumdar', photo: '/board-placement/capt-tapas-majumdar.png', designation: 'Independent Director at MCON Rasayan India Ltd.', industry: 'Manufacturing', expertise: ['Corporate Governance', 'Operations', 'Strategy'], badges: ['Independent Director'] },
      { id: 'c9', name: 'Jayanthi Talluri', photo: '/board-placement/jayanthi-talluri.png', designation: 'Independent Director at Refex Renewables & Infrastructure Ltd.', industry: 'Energy & Infrastructure', expertise: ['Corporate Governance', 'Renewables', 'ESG'], badges: ['Independent Director'] },
      { id: 'c10', name: 'Sandeep Budhrani', photo: '/board-placement/sandeep-budhrani.png', designation: 'Independent Director at Dinesh Engineers Ltd.', industry: 'Engineering', expertise: ['Corporate Governance', 'Engineering', 'Operations'], badges: ['Independent Director'] },
      { id: 'c11', name: 'Vikas Sethia', photo: '/board-placement/vikas-sethia.png', designation: 'Independent Director at Capital Numbers Ltd.', industry: 'Technology', expertise: ['Corporate Governance', 'Technology', 'Digital Strategy'], badges: ['Independent Director'] },
      { id: 'c12', name: 'C.N. Murthy', photo: '/board-placement/c-n-murthy.png', designation: 'Independent Director at Manika Plastech Ltd.', industry: 'Manufacturing', expertise: ['Corporate Governance', 'Manufacturing', 'Strategy'], badges: ['Independent Director'] },
      { id: 'c13', name: 'Nilesh Vikamsey', photo: '/board-placement/nIlesh-vikamsey.png', designation: 'Advisory Board Member at IFA Global', industry: 'Financial Services', expertise: ['Finance', 'Advisory', 'Capital Markets'], badges: ['Advisory Board Member'] },
      { id: 'c14', name: 'Ruchi Agnihotri', photo: '/board-placement/ruchi-agnihotri.png', designation: 'Independent Director at Renny Strips Pvt. Ltd.', industry: 'Manufacturing', expertise: ['Corporate Governance', 'Manufacturing', 'Compliance'], badges: ['Independent Director'] },
      { id: 'c15', name: 'Sunil Suri', photo: '/board-placement/sunil-suri.png', designation: 'Independent Director at Renny Strips Pvt. Ltd.', industry: 'Manufacturing', expertise: ['Corporate Governance', 'Risk Management', 'Finance'], badges: ['Independent Director'] },
      { id: 'c16', name: 'Sanjay Israni', photo: '/board-placement/sanjay-israni.png', designation: 'Independent Director at Manika Plastech Ltd.', industry: 'Manufacturing', expertise: ['Corporate Governance', 'Manufacturing', 'Operations'], badges: ['Independent Director'] },
      { id: 'c17', name: 'Mihir Nanavati', photo: '/board-placement/mihir-nanavati.png', designation: 'Advisory Board Member at IFA Global', industry: 'Financial Services', expertise: ['Finance', 'Advisory', 'Investment Strategy'], badges: ['Advisory Board Member'] },
      { id: 'c18', name: 'Sharayu Sawant', photo: '/board-placement/sharayu-sawant.png', designation: 'Independent Director at Coastal Marine Construction & Engineering Ltd.', industry: 'Infrastructure', expertise: ['Corporate Governance', 'Infrastructure', 'Legal'], badges: ['Independent Director'] },
      { id: 'c19', name: 'Maxson Lewis', photo: '/board-placement/maxson-lewis.png', designation: 'Non Exec-Independent Director at Advance Cable Technologies Pvt. Ltd.', industry: 'Technology', expertise: ['Corporate Governance', 'Technology', 'Manufacturing'], badges: ['Non-Executive Director'] },
      { id: 'c20', name: 'Captain K. Srinivas', photo: '/board-placement/captain-k-srinivas.png', designation: 'Non Exec-Independent Director at Advance Cable Technologies Pvt. Ltd.', industry: 'Technology', expertise: ['Corporate Governance', 'Strategic Leadership', 'Operations'], badges: ['Non-Executive Director'] },
    ];
    const stmt = db.prepare(`INSERT INTO community_members (id, name, photo, designation, industry, experience, expertise, badges, linkedin, order_num, active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, '', ?, ?, '#', ?, 1, ?, ?)`);
    defaults.forEach((m, i) => stmt.run(m.id, m.name, m.photo, m.designation, m.industry, JSON.stringify(m.expertise), JSON.stringify(m.badges), i + 1, now, now));
  }

  const contentRow = db.prepare("SELECT value FROM app_settings WHERE key = 'site_content'").get();
  if (!contentRow) {
    const defaultContent = {
      heroTitle: 'The Future of Board Opportunities Starts Here.',
      heroSubtitle: 'Connecting visionary organizations with governance leaders while helping professionals prepare for meaningful boardroom roles.',
      heroCtaPrimary: 'Post a Board Requirement',
      heroCtaSecondary: 'Join the Boardroom',
      aboutTitle: "BoardOpp is MentorMyBoard's governance ecosystem",
      aboutBody: 'Where directors express interest in board opportunities, companies express governance requirements, and both can assess their readiness.',
      trustNumbers: [
        { label: 'Organizations Served', value: '500+', sub: 'Across 18 industries' },
        { label: 'Governance Professionals', value: '5000+', sub: 'In our network' },
        { label: 'Programs Conducted', value: '1000+', sub: 'By MentorMyBoard' },
        { label: 'Board Opportunities', value: '200+', sub: 'Facilitated to date' },
      ],
      footerTagline: 'Transforming governance leadership across India.',
      contactEmail: 'hello@mentormyboard.com',
      contactPhone: '+91 98765 43210',
      assessmentCardUrl: '#',
      boardAssessmentUrl: '#',
    };
    db.prepare(`INSERT INTO app_settings (key, value, updated_at) VALUES ('site_content', ?, ?)`).run(JSON.stringify(defaultContent), now);
  }
}

function getDb() {
  if (!db) throw new Error('Database not initialized. Call initDb() first.');
  return db;
}

module.exports = { initDb, getDb };
