import { z } from "zod";

export const studentUserIdParamSchema = z.object({
  userId: z.string().uuid(
    "Student user ID must be a valid UUID."
  ),
});

export const updateStudentSchema = z
  .object({
    fullName: z.string().trim().min(1).optional(),
    email: z.string().trim().email().optional(),
    enrollmentNo: z.string().trim().min(1).optional(),
    department: z.string().trim().min(1).optional(),
    semester: z.number().int().positive().optional(),
    year: z.number().int().positive().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided.",
    }
  );

export const studentStatusSchema = z.object({
  isActive: z.boolean(),
});