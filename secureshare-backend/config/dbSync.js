import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import blobServiceClient from "./azureBlob.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const dbFilePath = path.join(__dirname, "..", "secureshare.db");

const containerName = process.env.AZURE_CONTAINER_NAME || "files";
const dbBlobName = "database/secureshare.db";

// Download database snapshot from Azure on startup
export async function downloadDbFromAzure() {
  if (!blobServiceClient) return;
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists();
    const blockBlobClient = containerClient.getBlockBlobClient(dbBlobName);

    const exists = await blockBlobClient.exists();
    if (exists) {
      console.log("☁️ Syncing SQLite database FROM Azure Blob Storage...");
      await blockBlobClient.downloadToFile(dbFilePath);
      console.log("✅ Database synced successfully from Azure!");
    } else {
      console.log("ℹ️ No existing database blob found in Azure. Creating new one.");
    }
  } catch (err) {
    console.warn("⚠️ Could not download DB from Azure:", err.message);
  }
}

// Backup local database file to Azure on user actions
export async function uploadDbToAzure() {
  if (!blobServiceClient) return;
  try {
    if (!fs.existsSync(dbFilePath)) return;
    const containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists();
    const blockBlobClient = containerClient.getBlockBlobClient(dbBlobName);

    await blockBlobClient.uploadFile(dbFilePath);
    console.log("☁️ Saved SQLite database snapshot to Azure Blob Storage!");
  } catch (err) {
    console.warn("⚠️ Could not save DB to Azure:", err.message);
  }
}