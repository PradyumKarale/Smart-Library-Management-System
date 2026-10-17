
import prisma from "../../prisma/prisma.js";

export const findCategoryByName = async (name) => {
  return prisma.category.findUnique({
    where: { name },
  });
};

export const createCategory = async (data) => {
  return prisma.category.create({
    data,
  });
};

export const findAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
};
