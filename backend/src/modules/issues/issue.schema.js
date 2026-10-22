import { z } from "zod";

export const issueBookSchema = z.object({
  studentUserId: z.string().uuid("A valid student user ID is required."),
  bookId: z.string().uuid("A valid book ID is required."),
});

export const loanIdParamSchema = z.object({
  loanId: z.string().uuid("A valid loan ID is required."),
});

export const loanQuerySchema = z.object({
  studentUserId: z.string().uuid().optional(),
  activeOnly: z.enum(["true", "false"]).optional(),
});
