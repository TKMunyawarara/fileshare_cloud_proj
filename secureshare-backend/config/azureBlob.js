import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

let blobServiceClient = null;

if (connectionString && connectionString !== "dummy" && connectionString.startsWith("DefaultEndpointsProtocol")) {
  try {
    blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  } catch (err) {
    console.warn("⚠️ Azure Blob connection string invalid:", err.message);
  }
}

export default blobServiceClient;