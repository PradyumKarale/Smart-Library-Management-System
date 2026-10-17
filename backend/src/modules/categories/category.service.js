
import { AppError } from "../../errors/AppError.js";
import {
  findCategoryByName,
  createCategory,
  findAllCategories,
} from "./category.repository.js";

export const createCategoryService = async (data) => {
  const normalizedName = data.name.trim();

  const existingCategory = await findCategoryByName(normalizedName);

  if (existingCategory) {
    throw new AppError("A category with this name already exists.", 409);
  }

  return createCategory({
    name: normalizedName,
    description: data.description?.trim() || null,
  });
};

export const getAllCategoriesService = async () => {
  return findAllCategories();
};
