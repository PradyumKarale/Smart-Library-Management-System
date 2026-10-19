
import { z } from "zod";

// Validate the User UUID in route parameters
export const librarianUserIdParamSchema = z.object({
  userId: z.string().uuid(
    "Librarian user ID must be a valid UUID."
  ),
});

// Validate data when creating a librarian
export const createLibrarianSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required."),
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  employeeId: z.string().trim().min(1, "Employee ID is required."),
  designation: z.string().trim().min(1, "Designation is required."),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
});

// Validate changes to an existing librarian
export const updateLibrarianSchema = z
  .object({
    fullName: z.string().trim().min(1).optional(),
    email: z.string().trim().email().optional(),
    employeeId: z.string().trim().min(1).optional(),
    designation: z.string().trim().min(1).optional(),
    phone: z.string().trim().nullable().optional(),
    address: z.string().trim().nullable().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided.",
    }
  );

// Validate account activation/deactivation
export const librarianStatusSchema = z.object({
  isActive: z.boolean(),
});
