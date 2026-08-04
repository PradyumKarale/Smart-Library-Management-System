import express from "express";
import cors from "cors";

const app = express();

// ================================
// Middleware
// ================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================================
// Health Check Route
// ================================
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Smart Library Management System API is running 🚀"
  });
});

export default app;