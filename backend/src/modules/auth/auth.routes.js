import { Router } from "express";

import { registerStudentController } from "./auth.controller.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

router.post(
  "/register/student",
  registerStudentController
);

export default router;