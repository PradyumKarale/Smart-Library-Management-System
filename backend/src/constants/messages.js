export const MESSAGES = {
  AUTH: {
  REGISTER_SUCCESS: "Registration completed successfully.",
  LOGIN_SUCCESS: "Login successful.",
  LOGOUT_SUCCESS: "Logout successful.",

  EMAIL_EXISTS: "Email is already registered.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  ROLE_NOT_FOUND: "Requested role was not found.",
  USER_NOT_FOUND: "User not found.",
  UNAUTHORIZED: "Unauthorized access.",
  FORBIDDEN: "You do not have permission to perform this action.",

  // ⭐ JWT Authentication
  AUTH_HEADER_MISSING: "Authorization header is missing.",
  INVALID_AUTH_FORMAT: "Invalid authorization format.",
  ACCOUNT_DISABLED: "Account has been disabled.",
},

  BOOK: {
    CREATED: "Book added successfully.",
    UPDATED: "Book updated successfully.",
    DELETED: "Book deleted successfully.",
    NOT_FOUND: "Book not found.",
  },

  STUDENT: {
    CREATED: "Student created successfully.",
    UPDATED: "Student updated successfully.",
    DELETED: "Student deleted successfully.",
  },

  LIBRARIAN: {
    CREATED: "Librarian created successfully.",
    UPDATED: "Librarian updated successfully.",
    DELETED: "Librarian deleted successfully.",
  },

  ISSUE: {
    SUCCESS: "Book issued successfully.",
    RETURN_SUCCESS: "Book returned successfully.",
  },

  RESERVATION: {
    CREATED: "Book reserved successfully.",
    CANCELLED: "Reservation cancelled successfully.",
  },

  COMMON: {
    SOMETHING_WENT_WRONG: "Something went wrong.",
    VALIDATION_FAILED: "Validation failed.",
  },
};