import { Router } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import db from "../config/db.js";
import s3Client from "../config/s3.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// Multer config (temp storage before S3 upload)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
});

// Helper: get icon from file type
function getIcon(mimetype) {
  if (mimetype.includes("pdf")) return "📄";
  if (mimetype.includes("image")) return "🖼️";
  if (mimetype.includes("spreadsheet") || mimetype.includes("excel")) return "📊";
  if (mimetype.includes("presentation") || mimetype.includes("powerpoint")) return "📊";
  if (mimetype.includes("word") || mimetype.includes("document")) return "📝";
  return "📄";
}

// Helper: get readable type
function getType(mimetype, filename) {
  const ext = path.extname(filename).toLowerCase();
  const map = {
    ".pdf": "PDF",
    ".jpg": "Image", ".jpeg": "Image", ".png": "Image", ".gif": "Image",
    ".xlsx": "Excel", ".xls": "Excel", ".csv": "Excel",
    ".pptx": "PowerPoint", ".ppt": "PowerPoint",
    ".docx": "Word", ".doc": "Word",
    ".txt": "Text",
    ".zip": "Archive", ".rar": "Archive",
  };
  return map[ext] || "File";
}

// Helper: format file size
function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

// UPLOAD FILE
router.post("/upload", authenticate, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const userId = req.user.id;
    const originalName = req.file.originalname;
    const s3Key = `${userId}/${uuidv4()}-${originalName}`;

    // Upload to S3
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3Key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });
    await s3Client.send(uploadCommand);

    // Save metadata to DB
    const result = db.prepare(`
      INSERT INTO files (user_id, original_name, s3_key, file_type, file_size, icon)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      originalName,
      s3Key,
      getType(req.file.mimetype, originalName),
      req.file.size,
      getIcon(req.file.mimetype)
    );

    const file = db.prepare("SELECT * FROM files WHERE id = ?").get(result.lastInsertRowid);

    res.status(201).json({
      id: file.id,
      name: file.original_name,
      icon: file.icon,
      type: file.file_type,
      size: formatSize(file.file_size),
      date: new Date(file.created_at).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      }),
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// LIST MY FILES
router.get("/", authenticate, (req, res) => {
  const files = db.prepare(
    "SELECT * FROM files WHERE user_id = ? ORDER BY created_at DESC"
  ).all(req.user.id);

  const formatted = files.map((f) => ({
    id: f.id,
    name: f.original_name,
    icon: f.icon,
    type: f.file_type,
    size: formatSize(f.file_size),
    date: new Date(f.created_at).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    }),
  }));

  res.json(formatted);
});

// DOWNLOAD FILE (returns presigned URL)
router.get("/:id/download", authenticate, async (req, res) => {
  try {
    const file = db.prepare(
      "SELECT * FROM files WHERE id = ? AND user_id = ?"
    ).get(req.params.id, req.user.id);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: file.s3_key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    res.json({ url, name: file.original_name });
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ error: "Download failed" });
  }
});

// RENAME FILE
router.patch("/:id/rename", authenticate, (req, res) => {
  const { newName } = req.body;

  if (!newName || !newName.trim()) {
    return res.status(400).json({ error: "New name is required" });
  }

  const file = db.prepare(
    "SELECT * FROM files WHERE id = ? AND user_id = ?"
  ).get(req.params.id, req.user.id);

  if (!file) {
    return res.status(404).json({ error: "File not found" });
  }

  db.prepare("UPDATE files SET original_name = ? WHERE id = ?")
    .run(newName.trim(), req.params.id);

  res.json({ message: "File renamed successfully" });
});

// DELETE FILE
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const file = db.prepare(
      "SELECT * FROM files WHERE id = ? AND user_id = ?"
    ).get(req.params.id, req.user.id);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Delete from S3
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: file.s3_key,
      })
    );

    // Delete shares
    db.prepare("DELETE FROM shares WHERE file_id = ?").run(file.id);

    // Delete from DB
    db.prepare("DELETE FROM files WHERE id = ?").run(file.id);

    res.json({ message: "File deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;