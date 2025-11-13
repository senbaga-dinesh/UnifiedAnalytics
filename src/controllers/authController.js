import db from "../models/index.js";
import { generateApiKey } from "../utils/generateApiKey.js";

const ApiKey = db.ApiKey;

// ✅ POST /api/auth/register
export const registerApp = async (req, res) => {
  try {
    const { appName, ownerEmail } = req.body;

    if (!appName || !ownerEmail) {
      return res.status(400).json({ message: "appName and ownerEmail are required" });
    }

    const newKey = generateApiKey();

    const apiKey = await ApiKey.create({
      appName,
      ownerEmail,
      apiKey: newKey,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days expiry
    });

    res.status(201).json({
      message: "App registered successfully",
      apiKey: apiKey.apiKey,
      expiresAt: apiKey.expiresAt,
    });
  } catch (err) {
    res.status(500).json({ message: "Error registering app", error: err.message });
  }
};

// ✅ GET /api/auth/api-key?key=xxxxx
export const getApiKeyDetails = async (req, res) => {
  try {
    const { key } = req.query;

    if (!key) {
      return res.status(400).json({ message: "API key is required" });
    }

    const cleanedKey = key.trim(); // remove spaces, newline chars
    const apiKey = await ApiKey.findOne({
      where: { apiKey: cleanedKey },
    });

    if (!apiKey) {
      return res.status(404).json({ message: "API key not found" });
    }

    res.json({
      appName: apiKey.appName,
      ownerEmail: apiKey.ownerEmail,
      isActive: apiKey.isActive,
      expiresAt: apiKey.expiresAt,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching API key details",
      error: err.message,
    });
  }
};

// ✅ DELETE /api/auth/api-key/:key
export const revokeApiKey = async (req, res) => {
  try {
    const { key } = req.params;

    const apiKey = await ApiKey.findOne({ where: { apiKey: key } });

    if (!apiKey) {
      return res.status(404).json({ message: "API key not found" });
    }

    apiKey.isActive = false;
    await apiKey.save();

    res.json({ message: "API key revoked successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error revoking API key", error: err.message });
  }
};

// ✅ PUT /api/auth/api-key/:key/regenerate
export const regenerateApiKey = async (req, res) => {
  try {
    const { key } = req.params;

    const apiKey = await ApiKey.findOne({ where: { apiKey: key } });

    if (!apiKey) {
      return res.status(404).json({ message: "API key not found" });
    }

    const newKey = generateApiKey();
    apiKey.apiKey = newKey;
    apiKey.isActive = true;
    apiKey.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // renew 30 days
    await apiKey.save();

    res.json({
      message: "API key regenerated successfully",
      apiKey: apiKey.apiKey,
      expiresAt: apiKey.expiresAt,
    });
  } catch (err) {
    res.status(500).json({ message: "Error regenerating API key", error: err.message });
  }
};

// ✅ GET /api/auth/list
export const listApiKeys = async (req, res) => {
  try {
    const keys = await ApiKey.findAll({
      attributes: ["id", "appName", "ownerEmail", "apiKey", "isActive", "expiresAt", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      total: keys.length,
      keys,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching API keys", error: err.message });
  }
};
