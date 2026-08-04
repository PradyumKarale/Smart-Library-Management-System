import { MESSAGES } from "../constants/messages.js";

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || MESSAGES.COMMON.SOMETHING_WENT_WRONG,
  });
};