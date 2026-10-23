import jwt from "jsonwebtoken";

/**
 * Generate JWT Token
 * @param {Object} payload
 * @returns {String}
 */
const JWT_SECRET = process.env.JWT_SECRET || "smart-library-secret-key-ai-studio-dev";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/**
 * Generate JWT Token
 * @param {Object} payload
 * @returns {String}
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Verify JWT Token
 * @param {String} token
 * @returns {Object}
 */
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};