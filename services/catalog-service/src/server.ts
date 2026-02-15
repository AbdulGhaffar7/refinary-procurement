import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import catalogRoutes from "./api/routes/catalogRoutes";
import connectDB from "./config/db";
import { swaggerOptions } from "./config/swagger";

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8001;

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// 1. Middlewares
app.use(cors());
app.use(express.json()); // Essential for parsing JSON bodies

connectDB();

app.use("/api/v1/catalog", catalogRoutes);

// 4. Health Check (Useful for monitoring)
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ service: "Catalog Service", status: "Active" });
});

// 5. Global Error Handler
app.use((err: any, req: Request, res: Response, next: any) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Catalog Service is running on http://localhost:${PORT}`);
});
