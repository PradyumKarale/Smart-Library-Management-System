
import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import {
  createBookService,
  getAllBooksService,
  getBookByIdService,
  updateBookService,
  deactivateBookService,
} from "./book.service.js";
import {
  createBookSchema,
  updateBookSchema,
} from "./book.schema.js";

export const createBookController = asyncHandler(async (req, res) => {
  const data = createBookSchema.parse(req.body);

  const book = await createBookService(data);

  return apiResponse({
    res,
    statusCode: 201,
    message: "Book created successfully.",
    data: book,
  });
});

export const getAllBooksController = asyncHandler(async (req, res) => {
  const categoryId = req.query.categoryId
    ? Number(req.query.categoryId)
    : undefined;

  const search =
    typeof req.query.search === "string"
      ? req.query.search.trim()
      : undefined;

  const books = await getAllBooksService({
    categoryId,
    search,
  });

  return apiResponse({
    res,
    statusCode: 200,
    message: "Books fetched successfully.",
    data: books,
  });
});

export const getBookByIdController = asyncHandler(async (req, res) => {
  const book = await getBookByIdService(req.params.id);

  return apiResponse({
    res,
    statusCode: 200,
    message: "Book fetched successfully.",
    data: book,
  });
});

export const updateBookController = asyncHandler(async (req, res) => {
  const data = updateBookSchema.parse(req.body);

  const book = await updateBookService(req.params.id, data);

  return apiResponse({
    res,
    statusCode: 200,
    message: "Book updated successfully.",
    data: book,
  });
});

export const deactivateBookController = asyncHandler(async (req, res) => {
  const book = await deactivateBookService(req.params.id);

  return apiResponse({
    res,
    statusCode: 200,
    message: "Book deactivated successfully.",
    data: book,
  });
});
