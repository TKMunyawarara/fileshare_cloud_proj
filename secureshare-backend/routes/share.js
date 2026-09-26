import { Router } from "express";
import db from "../config/db.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

// SHARE A FILE
router.post("/", authenticate, (req, res) => {
  const { fileId, email, permission } = req.body;

  if (!fileId || !email || !permission) {
    return res.status(400).json({ error: "fileId, email, and permission required" });
  }

  // Verify file belongs to user
  const file = db.prepare(
    "SELECT * FROM files WHERE id = ? AND user_id = ?"
  ).get(fileId, req.user.id);

  if (!file) {
    return res.status(404).json({ error: "File not found" });
  }

  // Check if already shared
  const existing = db.prepare(
    "SELECT id FROM shares WHERE file_id = ? AND shared_with_email = ?"
  ).get(fileId, email);

  if (existing) {
    return res.status(409).json({ error: "Already shared with this user" });
  }

  db.prepare(
    "INSERT INTO shares (file_id, shared_by, shared_with_email, permission) VALUES (?, ?, ?, ?)"
  ).run(fileId, req.user.id, email, permission);

  res.status(201).json({ message: `File shared with ${email}` });
});

// LIST FILES SHARED WITH ME
router.get("/", authenticate, (req, res) => {
  const shares = db.prepare(`
    SELECT s.*, f.original_name, f.icon, f.file_type, f.file_size, f.created_at,
           u.full_name AS shared_by_name
    FROM shares s
    JOIN files f ON s.file_id = f.id
    JOIN users u ON s.shared_by = u.id
    WHERE s.shared_with_email = ?
    ORDER BY s.created_at DESC
  `).all(req.user.email);

  const formatted = shares.map((s) => ({
    id: s.file_id,
    name: s.original_name,
    icon: s.icon,
    sharedBy: s.shared_by_name,
    permission: s.permission,
    size: formatSize(s.file_size),
    date: new Date(s.created_at).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    }),
  }));

  res.json(formatted);
});

export default router;