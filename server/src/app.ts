import express from "express";
import prisma from "./lib/prisma.js";
import plantRoutes from "./routes/plant.routes";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(express.json());
app.use("/api/plants", plantRoutes);
app.use("/api/auth", authRoutes);
app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to PlantHub API",
  });
});

app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

export default app;