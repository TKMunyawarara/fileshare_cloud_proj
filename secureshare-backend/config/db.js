import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Determine database path:
// On Azure App Service (Production), save to '/home/secureshare.db' for permanent storage.
// On your local machine, save to project root 'secureshare.db'.
let dbPath;
if (process.env.NODE_ENV === "production" && fs.existsSync("/home")) {
  dbPath = "/home/secureshare.db";
} else {
  dbPath = path.join(__dirname, "..", "secureshare.db");
}

console.log(`📁 SQLite database initialized at: ${dbPath}`);

const db = new Database(dbPath);

// Enable WAL mode for better concurrency performance
try {
  db.pragma("journal_mode = WAL");
} catch (e) {
  console.warn("⚠️ WAL mode fallback:", e.message);
}

// Initialize tables
db.exec(`
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

export default db;