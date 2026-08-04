import dotenv from "dotenv";
import app from "./app.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("=================================");
  console.log(" Smart Library Management System ");
  console.log("=================================");
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});