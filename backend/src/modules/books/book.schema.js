
import { z } from "zod";

export const createBookSchema = z.object({
  isbn: z
    .string()
    .trim()
    .min(10, "ISBN must be at least 10 characters")
    .max(17, "ISBN must not exceed 17 characters"),

  title: z
    .string()
    .trim()
    .min(1, "Book title is required")
    .max(191),

  author: z
    .string()
    .trim()
    .min(1, "Author name is required")
    .max(191),

  publisher: z
    .string()
    .trim()
    .max(191)
    .optional()
    .nullable(),

  publicationYear: z
    .number()
    .int()
    .min(1000)
    .max(new Date().getFullYear())
    .optional()
    .nullable(),

  shelfLocation: z
    .string()
    .trim()
    .max(100)
    .optional()
    .nullable(),

  totalCopies: z
    .number()
    .int()
    .min(1, "At least one copy is required")
    .max(10000)
    .default(1),

  categoryId: z
    .number()
    .int()
    .positive("A valid category ID is required"),
});

export const updateBookSchema = createBookSchema
  .omit({ totalCopies: true })
  .partial()
  .extend({
    totalCopies: z.number().int().min(1).max(10000).optional(),
    categoryId: z.number().int().positive().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided"
  );
