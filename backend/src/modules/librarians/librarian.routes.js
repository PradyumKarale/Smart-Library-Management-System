
import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";

import {
  getAllLibrariansController,
  getLibrarianByUserIdController,
  createLibrarianController,
  updateLibrarianController,
  updateLibrarianStatusController,
} from "./librarian.controller.js";

const router = Router();

// List librarians — Admin only
router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  getAllLibrariansController
);

// Create a librarian account — Admin only
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createLibrarianController
);

// Get one librarian by User UUID — Admin only
router.get(
  "/:userId",
  authenticate,
  authorize("ADMIN"),
  getLibrarianByUserIdController
);

// Activate/deactivate status route — Admin only
router.patch(
  "/:userId/status",
  authenticate,
  authorize("ADMIN"),
  updateLibrarianStatusController
);

// Update librarian details — Admin only
router.patch(
  "/:userId",
  authenticate,
  authorize("ADMIN"),
  updateLibrarianController
);

export default router;
