export default {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "smart-library-secret-key-ai-studio-dev",
  jwtExpires: process.env.JWT_EXPIRES_IN || "7d",
  aiProvider: process.env.AI_PROVIDER || "groq",
  groqApiKey: process.env.GROQ_API_KEY || "",
  groqModel: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
};