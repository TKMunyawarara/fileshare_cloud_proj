import { Router } from "express";
import db from "../config/db.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// GET PROFILE
router.get("/", authenticate, (req, res) => {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  // Calculate storage
  const storageResult = db.prepare(
    "SELECT COALESCE(SUM(file_size), 0) as total FROM files WHERE user_id = ?"
  ).get(req.user.id);

  const usedGB = (storageResult.total / (1024 * 1024 * 1024)).toFixed(1);
  const totalGB = 10;

  res.json({
    fullName: user.full_name,
    email: user.email,
    accountType: user.account_type,
    memberSince: new Date(user.created_at).toLocaleDateString("en-US", {
      month: "long", year: "numeric",
    }),
    storageUsed: `${usedGB} GB`,
    storageTotal: `${totalGB} GB`,
    storagePercent: Math.round((storageResult.total / (totalGB * 1024 * 1024 * 1024)) * 100),
  });
});

// UPDATE PROFILE
router.patch("/", authenticate, (req, res) => {
  const { fullName } = req.body;
  if (fullName) {
    db.prepare("UPDATE users SET full_name = ? WHERE id = ?")
      .run(fullName, req.user.id);
  }
  res.json({ message: "Profile updated" });
});

// GET SETTINGS
router.get("/settings", authenticate, (req, res) => {
  const settings = db.prepare(
    "SELECT * FROM settings WHERE user_id = ?"
  ).get(req.user.id);

  res.json({
    notifications: !!settings.notifications,
    emailNotifications: !!settings.email_notifications,
    darkMode: !!settings.dark_mode,
  });
});

// UPDATE SETTINGS
router.patch("/settings", authenticate, (req, res) => {
  const { notifications, emailNotifications, darkMode } = req.body;

  db.prepare(`
    UPDATE settings SET
      notifications = COALESCE(?, notifications),
      email_notifications = COALESCE(?, email_notifications),
      dark_mode = COALESCE(?, dark_mode)
    WHERE user_id = ?
  `).run(
    notifications !== undefined ? (notifications ? 1 : 0) : null,
    emailNotifications !== undefined ? (emailNotifications ? 1 : 0) : null,
    darkMode !== undefined ? (darkMode ? 1 : 0) : null,
    req.user.id
  );

  res.json({ message: "Settings updated" });
});

export default router;