const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'boardopp.db');
let db;

function initDb() {
  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
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

  console.log('[DB] Initialized at', DB_PATH);
  return db;
}

function getDb() {
  if (!db) throw new Error('Database not initialized. Call initDb() first.');
  return db;
}

module.exports = { initDb, getDb };
