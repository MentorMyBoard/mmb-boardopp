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

  console.log('[DB] Initialized at', DB_PATH);
  return db;
}

function getDb() {
  if (!db) throw new Error('Database not initialized. Call initDb() first.');
  return db;
}

module.exports = { initDb, getDb };
