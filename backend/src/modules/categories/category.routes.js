
import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import {
  createCategoryController,
  getAllCategoriesController,
} from "./category.controller.js";

const router = Router();

// List categories — all authenticated roles
router.get(
  "/",
  authenticate,
  authorize("ADMIN", "LIBRARIAN", "STUDENT"),
  getAllCategoriesController
);

// Create category — Admin and Librarian only
router.post(
  "/",
  authenticate,
  authorize("ADMIN", "LIBRARIAN"),
  createCategoryController
);

export default router;
