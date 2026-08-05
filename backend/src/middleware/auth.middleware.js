import { AppError } from "../errors/AppError.js";
import { verifyToken } from "../utils/jwt.js";
import prisma from "../prisma/prisma.js";
import { MESSAGES } from "../constants/messages.js";

/**
 * JWT Authentication Middleware
 */
export const authenticate = async (req, res, next) => {
  try {
    // 1. Read Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError(
  MESSAGES.AUTH.AUTH_HEADER_MISSING,
  401
);
    }

    // 2. Validate Bearer token
    if (!authHeader.startsWith("Bearer ")) {
      throw new AppError(
  MESSAGES.AUTH.INVALID_AUTH_FORMAT,
  401
);
    }

    // 3. Extract token
    const token = authHeader.split(" ")[1];

    // 4. Verify JWT
    const decoded = verifyToken(token);

    // 5. Load user
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      include: {
        role: true,
        studentProfile: true,
        librarianProfile: true,
      },
    });

    if (!user) {
      throw new AppError(
  MESSAGES.AUTH.USER_NOT_FOUND,
  401
);
    }

    if (!user.isActive) {
      throw new AppError(
  MESSAGES.AUTH.ACCOUNT_DISABLED,
  403
);
    }

    // 6. Attach user
    req.user = user;

    next();

  } catch (error) {
    next(error);
  }
};