import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { issueBookSchema, loanIdParamSchema, loanQuerySchema } from "./issue.schema.js";
import { issueBookService, returnBookService, getLoansService, getLoanByIdService } from "./issue.service.js";

export const issueBookController = asyncHandler(async (req, res) => {
  const { studentUserId, bookId } = issueBookSchema.parse(req.body);
  const loan = await issueBookService({ studentUserId, bookId, issuedById: req.user.id });
  return apiResponse({ res, statusCode: 201, message: "Book issued successfully.", data: loan });
});

export const returnBookController = asyncHandler(async (req, res) => {
  const { loanId } = loanIdParamSchema.parse(req.params);
  const loan = await returnBookService(loanId);
  return apiResponse({ res, statusCode: 200, message: "Book returned successfully.", data: loan });
});

export const getLoansController = asyncHandler(async (req, res) => {
  const query = loanQuerySchema.parse(req.query);
  // Students may only view their own loans; staff can filter by student.
  const isStudent = req.user.role?.roleName === "STUDENT";
  if (isStudent && query.studentUserId && query.studentUserId !== req.user.id) {
    return apiResponse({ res, statusCode: 403, success: false, message: "Students may only view their own loans.", data: null });
  }
  const loans = await getLoansService({
    studentUserId: isStudent ? req.user.id : query.studentUserId,
    activeOnly: query.activeOnly === "true",
  });
  return apiResponse({ res, statusCode: 200, message: "Loans fetched successfully.", data: loans });
});

export const getLoanByIdController = asyncHandler(async (req, res) => {
  const { loanId } = loanIdParamSchema.parse(req.params);
  const loan = await getLoanByIdService(loanId);
  if (req.user.role?.roleName === "STUDENT" && loan.studentUserId !== req.user.id) {
    return apiResponse({ res, statusCode: 403, success: false, message: "Students may only view their own loans.", data: null });
  }
  return apiResponse({ res, statusCode: 200, message: "Loan fetched successfully.", data: loan });
});
