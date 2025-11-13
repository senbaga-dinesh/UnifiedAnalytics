import request from "supertest";
import app, { server } from "../server.js";
import { redisClient } from "../config/redis.js";
import db from "../models/index.js";

describe("Integration: Analytics API", () => {
  // After all tests are done, close connections
  afterAll(async () => {
    await redisClient.quit();
    await db.sequelize.close();
    server.close();
  });

  test("should reject event collection without an API key", async () => {
    const res = await request(app)
      .post("/api/analytics/collect")
      .send({ event: "test_event" });
    expect(res.statusCode).toBe(401);
  });

  test("should reject event collection with invalid API key", async () => {
    const res = await request(app)
      .post("/api/analytics/collect")
      .set("x-api-key", "invalid_key_123")
      .send({
        event: "click_button",
        url: "https://example.com",
        device: "mobile",
      });
    expect([401, 403]).toContain(res.statusCode);
  });

  test("should collect an event successfully with valid API key", async () => {
    // Replace with your real API key from Postman if needed
    const validApiKey = "your_valid_api_key_here";
    const res = await request(app)
      .post("/api/analytics/collect")
      .set("x-api-key", "0635e0cb15db37bb43a9cd5926319178f5734f226721fec6")
      .send({
        event: "page_visit",
        url: "https://myapp.com/home",
        device: "desktop",
        referrer: "https://google.com",
      });
    expect([201]).toContain(res.statusCode);
  });
});
