
import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";

import {
  getAllLibrariansService,
  getLibrarianByUserIdService,
  createLibrarianService,
  updateLibrarianService,
  updateLibrarianStatusService,
} from "./librarian.service.js";

import {
  librarianUserIdParamSchema,
  createLibrarianSchema,
  updateLibrarianSchema,
  librarianStatusSchema,
} from "./librarian.schema.js";

// GET all librarians
export const getAllLibrariansController = asyncHandler(
  async (req, res) => {
    const librarians = await getAllLibrariansService();

    return apiResponse({
      res,
      statusCode: 200,
      message: "Librarians fetched successfully.",
      data: librarians,
    });
  }
);

// GET one librarian by User UUID
export const getLibrarianByUserIdController = asyncHandler(
  async (req, res) => {
    const { userId } = librarianUserIdParamSchema.parse(req.params);

    const librarian = await getLibrarianByUserIdService(userId);

    return apiResponse({
      res,
      statusCode: 200,
      message: "Librarian fetched successfully.",
      data: librarian,
    });
  }
);

// CREATE a librarian account
export const createLibrarianController = asyncHandler(
  async (req, res) => {
    const data = createLibrarianSchema.parse(req.body);

    const librarian = await createLibrarianService(data);

    return apiResponse({
      res,
      statusCode: 201,
      message: "Librarian created successfully.",
      data: librarian,
    });
  }
);

// PATCH librarian details
export const updateLibrarianController = asyncHandler(
  async (req, res) => {
    const { userId } = librarianUserIdParamSchema.parse(req.params);
    const data = updateLibrarianSchema.parse(req.body);

    const librarian = await updateLibrarianService(userId, data);

    return apiResponse({
      res,
      statusCode: 200,
      message: "Librarian updated successfully.",
      data: librarian,
    });
  }
);

// PATCH librarian account status
export const updateLibrarianStatusController = asyncHandler(
  async (req, res) => {
    const { userId } = librarianUserIdParamSchema.parse(req.params);
    const { isActive } = librarianStatusSchema.parse(req.body);

    const librarian = await updateLibrarianStatusService(
      userId,
      isActive
    );

    return apiResponse({
      res,
      statusCode: 200,
      message: isActive
        ? "Librarian account activated successfully."
        : "Librarian account deactivated successfully.",
      data: librarian,
    });
  }
);
