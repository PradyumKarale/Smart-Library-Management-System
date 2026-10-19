import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import categoryRoutes from "./modules/categories/category.routes.js";
import bookRoutes from "./modules/books/book.routes.js";
import studentRoutes from "./modules/students/student.routes.js";


const app = express();

// ================================
// Middleware
// ================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/students", studentRoutes);

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