import db from "../models/index.js";
import { redisClient } from "../config/redis.js"; // ✅ added for caching

const Event = db.Event;

// POST /api/analytics/collect
export const collectEvent = async (req, res) => {
  try {
    const { event, url, referrer, device, userId, ipAddress, metadata } = req.body;

    if (!event) {
      return res.status(400).json({ message: "Event name is required" });
    }

    // Save event with API key reference from middleware
    const newEvent = await Event.create({
      apiKey: req.apiKeyInfo.apiKey,
      userId: userId || null,
      event,
      url,
      referrer,
      device,
      ipAddress: ipAddress || req.ip, // fallback to request IP
      metadata,
    });

    // Invalidate cache for this API key (since new data added)
    const cacheKeyAll = `event-summary:${req.apiKeyInfo.apiKey}:all`;
    const cacheKeySpecific = `event-summary:${req.apiKeyInfo.apiKey}:${event}`;
    await redisClient.del(cacheKeyAll, cacheKeySpecific);

    res.status(201).json({
      message: "Event collected successfully",
      id: newEvent.id,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error collecting event",
      error: err.message,
    });
  }
};

// GET /api/analytics/event-summary?event=login_click
export const getEventSummary = async (req, res) => {
  try {
    const { event } = req.query;
    const { apiKeyInfo } = req;

    const cacheKey = `event-summary:${apiKeyInfo.apiKey}:${event || "all"}`;

    // ✅ Step 1: Check cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("⚡ Returning cached analytics summary");
      return res.json(JSON.parse(cachedData));
    }

    // ✅ Step 2: Query DB
    const whereClause = { apiKey: apiKeyInfo.apiKey };
    if (event) whereClause.event = event;

    const totalEvents = await db.Event.count({ where: whereClause });

    const byDevice = await db.Event.findAll({
      attributes: ["device", [db.sequelize.fn("COUNT", db.sequelize.col("device")), "count"]],
      where: whereClause,
      group: ["device"],
    });

    const byReferrer = await db.Event.findAll({
      attributes: ["referrer", [db.sequelize.fn("COUNT", db.sequelize.col("referrer")), "count"]],
      where: whereClause,
      group: ["referrer"],
    });

    const result = {
      totalEvents,
      byDevice,
      byReferrer,
    };

    // ✅ Step 3: Store result in Redis (TTL 60 sec)
    await redisClient.setex(cacheKey, 60, JSON.stringify(result));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error fetching event summary", error: err.message });
  }
};

// GET /api/analytics/user-stats?userId=user123
export const getUserStats = async (req, res) => {
  try {
    const { userId } = req.query;
    const { apiKeyInfo } = req;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const totalEvents = await db.Event.count({
      where: { apiKey: apiKeyInfo.apiKey, userId },
    });

    const recentEvents = await db.Event.findAll({
      where: { apiKey: apiKeyInfo.apiKey, userId },
      order: [["timestamp", "DESC"]],
      limit: 10,
    });

    const byDevice = await db.Event.findAll({
      attributes: ["device", [db.sequelize.fn("COUNT", db.sequelize.col("device")), "count"]],
      where: { apiKey: apiKeyInfo.apiKey, userId },
      group: ["device"],
    });

    res.json({
      userId,
      totalEvents,
      recentEvents,
      byDevice,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user stats", error: err.message });
  }
};
