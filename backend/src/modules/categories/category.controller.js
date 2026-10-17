
import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import {
  createCategoryService,
  getAllCategoriesService,
} from "./category.service.js";
import { createCategorySchema } from "./category.schema.js";

export const createCategoryController = asyncHandler(async (req, res) => {
  const data = createCategorySchema.parse(req.body);

  const category = await createCategoryService(data);

  return apiResponse({
    res,
    statusCode: 201,
    message: "Category created successfully.",
    data: category,
  });
});

export const getAllCategoriesController = asyncHandler(async (req, res) => {
  const categories = await getAllCategoriesService();

  return apiResponse({
    res,
    statusCode: 200,
    message: "Categories fetched successfully.",
    data: categories,
  });
});
