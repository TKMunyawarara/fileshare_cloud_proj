import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import fileRoutes from "./routes/files.js";
import shareRoutes from "./routes/share.js";
import profileRoutes from "./routes/profile.js";
import dashboardRoutes from "./routes/dashboard.js";
import { downloadDbFromAzure } from "./config/dbSync.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/share", shareRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "SecureShare API is running on Azure! 🚀" });
});

// React static files
const frontendDistPath = path.join(__dirname, "../secureshare-frontend/dist");
app.use(express.static(frontendDistPath));

app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(frontendDistPath, "index.html"), (err) => {
      if (err) {
        res.status(200).send("SecureShare API is running.");
      }
    });
  }
});

// Start Server with Azure DB Sync
async function startServer() {
  console.log("⌛ Initializing SecureShare & Syncing Cloud Database...");
  await downloadDbFromAzure();

  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}

startServer();