import jwt from "jsonwebtoken";

/**
 * Generate JWT Token
 * @param {Object} payload
 * @returns {String}
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/**
 * Verify JWT Token
 * @param {String} token
 * @returns {Object}
 */
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};