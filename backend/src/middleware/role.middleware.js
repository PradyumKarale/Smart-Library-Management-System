import { AppError } from "../errors/AppError.js";
import { MESSAGES } from "../constants/messages.js";

/**
 * Role-Based Access Control Middleware
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // User should already be attached by authenticate middleware
    if (!req.user) {
      return next(
        new AppError(
          MESSAGES.AUTH.UNAUTHORIZED,
          401
        )
      );
    }

    const userRole = req.user.role.roleName;

    if (!allowedRoles.includes(userRole)) {
      return next(
        new AppError(
          MESSAGES.AUTH.FORBIDDEN,
          403
        )
      );
    }

    next();
  };
};