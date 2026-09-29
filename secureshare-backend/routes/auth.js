import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import { uploadDbToAzure } from "../config/dbSync.js";

const router = Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const result = db.prepare(
    "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)"
  ).run(fullName, email, hashedPassword);

  const userId = result.lastInsertRowid;

  db.prepare("INSERT INTO settings (user_id) VALUES (?)").run(userId);

  // ☁️ Backup updated database to Azure Blob Storage
  uploadDbToAzure().catch((err) => console.error("Azure Sync Error:", err));

  const token = jwt.sign(
    { id: userId, email, fullName },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.status(201).json({
    token,
    user: { id: userId, fullName, email, accountType: "User" },
  });
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, fullName: user.full_name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user: {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      accountType: user.account_type,
    },
  });
});

export default router;