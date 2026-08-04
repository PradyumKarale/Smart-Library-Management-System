/**
 * Wraps async route handlers and forwards errors to Express.
 */
export const asyncHandler = (handler) => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};