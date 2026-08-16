import express from "express";

const app = express();

app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to PlantHub API",
  });
});

export default app;