import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Unified Event Analytics API",
      version: "1.0.0",
      description:
        "REST API for collecting, managing, and analyzing web and mobile app events. Built with Node.js, Express, PostgreSQL, and Redis.",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local server",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // 👈 Swagger will read annotations from all route files
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export { swaggerUi, swaggerSpec };
