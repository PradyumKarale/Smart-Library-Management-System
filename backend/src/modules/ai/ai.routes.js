import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import { chatController } from "./ai.controller.js";

const router = Router();

// Authenticated AI chat endpoint — accessible to all logged-in roles
router.post(
  "/chat",
  authenticate,
  authorize("ADMIN", "LIBRARIAN", "STUDENT"),
  chatController
);

export default router;
