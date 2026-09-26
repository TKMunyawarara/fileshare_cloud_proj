import { Router } from "express";
import db from "../config/db.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/stats", authenticate, (req, res) => {
  const userId = req.user.id;

  const totalFiles = db.prepare(
    "SELECT COUNT(*) as count FROM files WHERE user_id = ?"
  ).get(userId).count;

  const sharedCount = db.prepare(
    "SELECT COUNT(*) as count FROM shares WHERE shared_by = ?"
  ).get(userId).count;

  const storageResult = db.prepare(
    "SELECT COALESCE(SUM(file_size), 0) as total FROM files WHERE user_id = ?"
  ).get(userId);

  const usedGB = (storageResult.total / (1024 * 1024 * 1024)).toFixed(1);
  const percent = Math.round((storageResult.total / (10 * 1024 * 1024 * 1024)) * 100);

  res.json({
    totalFiles,
    sharedFiles: sharedCount,
    storageUsed: `${usedGB} / 10 GB`,
    storagePercent: `${percent}% Used`,
  });
});

export default router;