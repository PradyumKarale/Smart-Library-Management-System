import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import { issueBookController, returnBookController, getLoansController, getLoanByIdController } from "./issue.controller.js";

const router = Router();
router.use(authenticate);
router.get("/", authorize("ADMIN", "LIBRARIAN", "STUDENT"), getLoansController);
router.get("/:loanId", authorize("ADMIN", "LIBRARIAN", "STUDENT"), getLoanByIdController);
router.post("/", authorize("ADMIN", "LIBRARIAN"), issueBookController);
router.post("/:loanId/return", authorize("ADMIN", "LIBRARIAN"), returnBookController);
export default router;
