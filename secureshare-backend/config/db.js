import Database from "better-sqlite3";
import { dbFilePath } from "./dbSync.js";

let dbInstance = null;

function initDb() {
  if (!dbInstance) {
    dbInstance = new Database(dbFilePath);
    try {
      dbInstance.pragma("journal_mode = WAL");
    } catch (e) {}

    dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        account_type TEXT DEFAULT 'User',
        created_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        original_name TEXT NOT NULL,
        s3_key TEXT NOT NULL UNIQUE,
        file_type TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        icon TEXT DEFAULT '📄',
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS shares (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        file_id INTEGER NOT NULL,
        shared_by INTEGER NOT NULL,
        shared_with_email TEXT NOT NULL,
        permission TEXT DEFAULT 'View',
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (file_id) REFERENCES files(id),
        FOREIGN KEY (shared_by) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE NOT NULL,
        notifications INTEGER DEFAULT 1,
        email_notifications INTEGER DEFAULT 1,
        dark_mode INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);
  }
  return dbInstance;
}

// Proxy traps calls so DB initializes AFTER Azure sync on startup
const db = new Proxy({}, {
  get(target, prop) {
    const instance = initDb();
    return typeof instance[prop] === "function"
      ? instance[prop].bind(instance)
      : instance[prop];
  },
});

export default db;