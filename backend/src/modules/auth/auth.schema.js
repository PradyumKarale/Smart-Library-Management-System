import { z } from "zod";

/*
|--------------------------------------------------------------------------
| Student Registration Schema
|--------------------------------------------------------------------------
*/

export const registerStudentSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .max(100),

  email: z
    .string()
    .email("Invalid email address")
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32),

  enrollmentNo: z
    .string()
    .min(3)
    .max(30),

  department: z.enum([
    "CSE",
    "AI_DS",
    "IT",
    "ENTC",
    "MECH",
    "CIVIL",
  ]),

  semester: z
    .number()
    .int()
    .min(1)
    .max(8),

  year: z
    .number()
    .int()
    .min(1)
    .max(4),
});

/*
|--------------------------------------------------------------------------
| Login Schema
|--------------------------------------------------------------------------
*/

export const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});