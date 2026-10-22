import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import backendApp from "./backend/src/app.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || "3000", 10);
const HOST = "0.0.0.0";
const isProduction = process.env.NODE_ENV === "production";

async function createMainServer() {
  const app = express();

  // Mount backend API routes and health check
  app.use(backendApp);

  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      configFile: path.resolve(__dirname, "frontend", "vite.config.ts"),
      root: path.resolve(__dirname, "frontend"),
      server: { middlewareMode: true, host: HOST, port: PORT },
      appType: "spa",
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "frontend", "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api") || req.path === "/health") {
        return next();
      }
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log("=========================================");
    console.log(" Smart Library Management System (SLMS)  ");
    console.log("=========================================");
    console.log(`🚀 Application server running at http://${HOST}:${PORT}`);
  });
}

createMainServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
