import express from "express";
import {
  collectEvent,
  getEventSummary,
  getUserStats,
} from "../controllers/analyticsController.js";
import { verifyApiKey } from "../middleware/authMiddleware.js";
import { apiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Endpoints for collecting and analyzing user events
 */

/**
 * @swagger
 * /api/analytics/collect:
 *   post:
 *     summary: Collects an analytics event
 *     description: Records an event such as a click, page view, or visit. Requires a valid API key.
 *     tags: [Analytics]
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         description: API key for authentication
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event
 *             properties:
 *               event:
 *                 type: string
 *                 example: page_view
 *               url:
 *                 type: string
 *                 example: https://example.com
 *               referrer:
 *                 type: string
 *                 example: https://google.com
 *               device:
 *                 type: string
 *                 example: desktop
 *               userId:
 *                 type: string
 *                 example: user123
 *               ipAddress:
 *                 type: string
 *                 example: 192.168.1.100
 *     responses:
 *       201:
 *         description: Event collected successfully
 *       400:
 *         description: Invalid or missing data
 *       401:
 *         description: Unauthorized or invalid API key
 */

/**
 * @swagger
 * /api/analytics/event-summary:
 *   get:
 *     summary: Retrieves aggregated analytics event summary
 *     description: Returns total events grouped by device and referrer for the authenticated API key.
 *     tags: [Analytics]
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         description: API key for authentication
 *         schema:
 *           type: string
 *       - in: query
 *         name: event
 *         required: false
 *         description: Optional event name to filter summary
 *         schema:
 *           type: string
 *           example: page_view
 *     responses:
 *       200:
 *         description: Analytics summary data
 *       401:
 *         description: Invalid or expired API key
 */

/**
 * @swagger
 * /api/analytics/user-stats:
 *   get:
 *     summary: Retrieves analytics for a specific user
 *     description: Returns event counts and recent events for a given userId under the authenticated API key.
 *     tags: [Analytics]
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         description: API key for authentication
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         required: true
 *         description: The user ID to fetch stats for
 *         schema:
 *           type: string
 *           example: user123
 *     responses:
 *       200:
 *         description: User analytics data returned successfully
 *       400:
 *         description: Missing or invalid userId
 *       401:
 *         description: Unauthorized or invalid API key
 */

// Apply rate limiter and authentication
router.post("/collect", verifyApiKey, apiLimiter, collectEvent);
router.get("/event-summary", verifyApiKey, apiLimiter, getEventSummary);
router.get("/user-stats", verifyApiKey, apiLimiter, getUserStats);

export default router;
