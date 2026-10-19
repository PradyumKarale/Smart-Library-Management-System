import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import {
  getAllStudentsController,
  getStudentByUserIdController,
  updateStudentController,
  updateStudentStatusController,
} from "./student.controller.js";

const router = Router();

// List students — Admin and Librarian
router.get(
  "/",
  authenticate,
  authorize("ADMIN", "LIBRARIAN"),
  getAllStudentsController
);

// Get one student — Admin and Librarian
router.get(
  "/:userId",
  authenticate,
  authorize("ADMIN", "LIBRARIAN"),
  getStudentByUserIdController
);

// Update student details — Admin and Librarian
router.patch(
  "/:userId",
  authenticate,
  authorize("ADMIN", "LIBRARIAN"),
  updateStudentController
);

// Activate/deactivate student — Admin only
router.patch(
  "/:userId/status",
  authenticate,
  authorize("ADMIN"),
  updateStudentStatusController
);

export default router;