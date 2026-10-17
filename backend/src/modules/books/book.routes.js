
import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import {
  createBookController,
  getAllBooksController,
  getBookByIdController,
  updateBookController,
  deactivateBookController,
} from "./book.controller.js";

const router = Router();

// List active books — all authenticated roles
router.get(
  "/",
  authenticate,
  authorize("ADMIN", "LIBRARIAN", "STUDENT"),
  getAllBooksController
);

// Get a book by ID — all authenticated roles
router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "LIBRARIAN", "STUDENT"),
  getBookByIdController
);

// Create a book — Admin and Librarian only
router.post(
  "/",
  authenticate,
  authorize("ADMIN", "LIBRARIAN"),
  createBookController
);

// Update a book — Admin and Librarian only
router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN", "LIBRARIAN"),
  updateBookController
);

// Deactivate a book — Admin and Librarian only
router.patch(
  "/:id/deactivate",
  authenticate,
  authorize("ADMIN", "LIBRARIAN"),
  deactivateBookController
);

export default router;
