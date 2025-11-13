import express from "express";
import {
  registerApp,
  revokeApiKey,
  regenerateApiKey,
  listApiKeys,
  getApiKeyDetails,
} from "../controllers/authController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints for API key registration and management
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new app and obtain an API key
 *     tags: [Auth]
 *     description: Registers a new website or app to use the analytics service. Returns a new API key and expiration date.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appName:
 *                 type: string
 *                 example: MyWebsite
 *               ownerEmail:
 *                 type: string
 *                 example: owner@example.com
 *     responses:
 *       201:
 *         description: App registered successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/auth/api-key/{key}:
 *   delete:
 *     summary: Revoke an existing API key
 *     tags: [Auth]
 *     description: Marks an API key as inactive (revoked). The key will no longer work for authentication.
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         description: API key to revoke
 *         schema:
 *           type: string
 *           example: abcd1234efgh5678
 *     responses:
 *       200:
 *         description: API key revoked successfully
 *       404:
 *         description: API key not found
 */

/**
 * @swagger
 * /api/auth/api-key/{key}/regenerate:
 *   put:
 *     summary: Regenerate an API key
 *     tags: [Auth]
 *     description: Generates a new API key for an existing app while keeping its metadata intact.
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         description: Old API key to regenerate
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: API key regenerated successfully
 *       404:
 *         description: API key not found
 */

/**
 * @swagger
 * /api/auth/list:
 *   get:
 *     summary: List all registered API keys
 *     tags: [Auth]
 *     description: Returns all registered API keys with their status and expiration.
 *     responses:
 *       200:
 *         description: Successfully retrieved API keys
 */

router.post("/register", registerApp);
router.delete("/api-key/:key", revokeApiKey);
router.put("/api-key/:key/regenerate", regenerateApiKey);
router.get("/list", listApiKeys);
router.get("/api-key", getApiKeyDetails);

export default router;
