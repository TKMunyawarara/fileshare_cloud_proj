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

dotenv.config();

// ES Module path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Azure App Service automatically injects process.env.PORT
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Serve local uploads statically (fallback if Azure Blob storage fails)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/share", shareRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "SecureShare API is running on Azure! 🚀" });
});

// Serve React Frontend static files (from the build folder)
const frontendDistPath = path.join(__dirname, "../secureshare-frontend/dist");
app.use(express.static(frontendDistPath));

// Catch-all route: Redirects all non-API web requests to React's index.html
// This allows React Router (Dashboard, My Files, Profile, etc.) to work properly
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(frontendDistPath, "index.html"), (err) => {
      if (err) {
        // Fallback response if the dist folder hasn't been built yet
        res.status(200).send("SecureShare API is running. Please build the frontend (npm run build).");
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});