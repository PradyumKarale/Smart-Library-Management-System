
import { ZodError } from "zod";
import { MESSAGES } from "../constants/messages.js";

export const errorHandler = (err, req, res, next) => {
  // Handle request validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: MESSAGES.COMMON.VALIDATION_FAILED,
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  // Handle known application errors and unexpected errors
  const statusCode = err.statusCode || 500;

  if (statusCode >= 500) {
    console.error(err);
  }

  return res.status(statusCode).json({
    success: false,
    message:
      statusCode >= 500
        ? MESSAGES.COMMON.SOMETHING_WENT_WRONG
        : err.message || MESSAGES.COMMON.SOMETHING_WENT_WRONG,
  });
};
