import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import {
  registerStudentController,
  loginController,
  getCurrentUserController,
} from "./auth.controller.js";
import { authorize } from "../../middleware/role.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

// Register Student
router.post(
  "/register/student",
  registerStudentController
);

// Login
router.post(
  "/login",
  loginController
);

router.get(
  "/me",
  authenticate,
  authorize("ADMIN", "LIBRARIAN", "STUDENT"),
  getCurrentUserController
);

export default router;