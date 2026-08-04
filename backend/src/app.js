import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

// ================================
// Middleware
// ================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);

// ================================
// Health Check Route
// ================================
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Smart Library Management System API is running 🚀"
  });
});

app.use(errorHandler);

export default app;