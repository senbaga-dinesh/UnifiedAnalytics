import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { sequelize } from "./config/db.js";   // ✅ Added import for Sequelize connection
import db from "./models/index.js";
import authRoutes from "./routes/authRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import { swaggerUi, swaggerSpec } from "./docs/swagger.js";


// Load .env file
dotenv.config();

const app = express();

// Middleware setup
app.use(express.json());   // Parse JSON body
app.use(helmet());         // Security headers
app.use(cors());           // Allow cross-origin requests
app.use(morgan("dev"));    // Log HTTP requests in console

// Simple test route
app.get("/", (req, res) => {
  res.send("✅ Unified Event Analytics Server is running...");
});

// PostgreSQL connection test
(async () => {
  try {
    await sequelize.authenticate();   // Test DB connection
    console.log("✅ PostgreSQL connection established successfully");
  } catch (err) {
    console.error("❌ Unable to connect to the database:", err.message);
  }
})();

// Port (from .env or default 5000)
const PORT = process.env.PORT || 5000;

//auth
app.use("/api/auth", authRoutes);


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


//DB
(async () => {
  try {
    await db.sequelize.sync({ alter: true });
    console.log("✅ Database synchronized — tables created or updated");
  } catch (err) {
    console.error("❌ Error syncing database:", err.message);
  }
})();

//analytics
app.use("/api/analytics", analyticsRoutes);


// Swagger API docs
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


//test
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
export default app;
export { server };