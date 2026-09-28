import { Router } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { BlobSASPermissions } from "@azure/storage-blob";

import db from "../config/db.js";
import blobServiceClient from "../config/azureBlob.js";
import { authenticate } from "../middleware/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

const containerName = process.env.AZURE_CONTAINER_NAME || "files";

// Helpers
function getIcon(mimetype) {
  if (mimetype.includes("pdf")) return "📄";
  if (mimetype.includes("image")) return "🖼️";
  if (mimetype.includes("spreadsheet") || mimetype.includes("excel")) return "📊";
  if (mimetype.includes("presentation") || mimetype.includes("powerpoint")) return "📊";
  if (mimetype.includes("word") || mimetype.includes("document")) return "📝";
  return "📄";
}

function getType(mimetype, filename) {
  const ext = path.extname(filename).toLowerCase();
  const map = {
    ".pdf": "PDF",
    ".jpg": "Image", ".jpeg": "Image", ".png": "Image", ".gif": "Image",
    ".xlsx": "Excel", ".xls": "Excel", ".csv": "Excel",
    ".pptx": "PowerPoint", ".ppt": "PowerPoint",
    ".docx": "Word", ".doc": "Word",
    ".txt": "Text",
  };
  return map[ext] || "File";
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

// UPLOAD FILE TO AZURE BLOB / LOCAL
router.post("/upload", authenticate, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const userId = req.user.id;
    const originalName = req.file.originalname;
    const blobName = `${userId}/${uuidv4()}-${originalName}`;
    let isAzure = false;

    if (blobServiceClient) {
      try {
        const containerClient = blobServiceClient.getContainerClient(containerName);
        await containerClient.createIfNotExists();
        
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.uploadData(req.file.buffer, {
          blobHTTPHeaders: { blobContentType: req.file.mimetype },
        });
        isAzure = true;
      } catch (azureErr) {
        console.warn("⚠️ Azure Blob upload failed, saving to local disk:", azureErr.message);
      }
    }

    if (!isAzure) {
      const userFolder = path.join(uploadsDir, String(userId));
      if (!fs.existsSync(userFolder)) {
        fs.mkdirSync(userFolder, { recursive: true });
      }
      fs.writeFileSync(path.join(uploadsDir, blobName), req.file.buffer);
    }

    const result = db.prepare(`
      INSERT INTO files (user_id, original_name, s3_key, file_type, file_size, icon)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      originalName,
      blobName,
      getType(req.file.mimetype, originalName),
      req.file.size,
      getIcon(req.file.mimetype)
    );

    const file = db.prepare("SELECT * FROM files WHERE id = ?").get(result.lastInsertRowid);

    console.log(`✅ File uploaded (${isAzure ? "Azure Blob Storage" : "Local Disk"}): ${originalName}`);

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
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: "Upload failed: " + err.message });
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

// DOWNLOAD FILE (Allows Owner OR Shared Recipient)
router.get("/:id/download", authenticate, async (req, res) => {
  try {
    // Check if the user is the OWNER or if the file was SHARED with their email
    const file = db.prepare(`
      SELECT DISTINCT f.* FROM files f
      LEFT JOIN shares s ON f.id = s.file_id
      WHERE f.id = ? AND (f.user_id = ? OR s.shared_with_email = ?)
    `).get(req.params.id, req.user.id, req.user.email);

    if (!file) {
      return res.status(404).json({ error: "File not found or access denied" });
    }

    if (blobServiceClient) {
      try {
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(file.s3_key);

        // Generate temporary SAS download URL (Valid for 1 hour)
        const sasUrl = await blockBlobClient.generateSasUrl({
          permissions: BlobSASPermissions.parse("r"), // Read permission
          expiresOn: new Date(new Date().valueOf() + 3600 * 1000),
        });

        return res.json({ url: sasUrl, name: file.original_name });
      } catch (azureErr) {
        console.warn("Azure SAS link generation failed, checking local storage...");
      }
    }

    // Local fallback
    const localFilePath = path.join(uploadsDir, file.s3_key);
    if (fs.existsSync(localFilePath)) {
      return res.json({ url: `/uploads/${file.s3_key}`, name: file.original_name });
    }

    res.status(404).json({ error: "File binary not found" });
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

  if (!file) return res.status(404).json({ error: "File not found" });

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

    if (!file) return res.status(404).json({ error: "File not found" });

    if (blobServiceClient) {
      try {
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(file.s3_key);
        await blockBlobClient.deleteIfExists();
      } catch (e) {}
    }

    const localFilePath = path.join(uploadsDir, file.s3_key);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    db.prepare("DELETE FROM shares WHERE file_id = ?").run(file.id);
    db.prepare("DELETE FROM files WHERE id = ?").run(file.id);

    res.json({ message: "File deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;