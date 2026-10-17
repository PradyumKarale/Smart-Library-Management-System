
import prisma from "../../prisma/prisma.js";

export const findBookByIsbn = async (isbn) => {
  return prisma.book.findUnique({
    where: { isbn },
  });
};

export const findBookById = async (id) => {
  return prisma.book.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });
};

export const findCategoryById = async (categoryId) => {
  return prisma.category.findUnique({
    where: { id: categoryId },
  });
};

export const createBook = async (data) => {
  return prisma.book.create({
    data,
    include: {
      category: true,
    },
  });
};

export const findAllBooks = async (where = {}) => {
  return prisma.book.findMany({
    where,
    include: {
      category: true,
    },
    orderBy: {
      title: "asc",
    },
  });
};

export const updateBook = async (id, data) => {
  return prisma.book.update({
    where: { id },
    data,
    include: {
      category: true,
    },
  });
};

export const deactivateBook = async (id) => {
  return prisma.book.update({
    where: { id },
    data: {
      isActive: false,
    },
    include: {
      category: true,
    },
  });
};
