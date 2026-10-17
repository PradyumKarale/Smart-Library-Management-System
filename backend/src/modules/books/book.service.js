
import { AppError } from "../../errors/AppError.js";
import {
  findBookByIsbn,
  findBookById,
  findCategoryById,
  createBook,
  findAllBooks,
  updateBook,
  deactivateBook,
} from "./book.repository.js";

export const createBookService = async (data) => {
  const isbn = data.isbn.trim();

  const existingBook = await findBookByIsbn(isbn);

  if (existingBook) {
    throw new AppError("A book with this ISBN already exists.", 409);
  }

  const category = await findCategoryById(data.categoryId);

  if (!category) {
    throw new AppError("Category not found.", 404);
  }

  const totalCopies = data.totalCopies ?? 1;

  return createBook({
    ...data,
    isbn,
    totalCopies,
    availableCopies: totalCopies,
  });
};

export const getAllBooksService = async (filters = {}) => {
  const where = {
    isActive: true,
  };

  if (filters.categoryId !== undefined) {
    where.categoryId = filters.categoryId;
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search } },
      { author: { contains: filters.search } },
      { isbn: { contains: filters.search } },
    ];
  }

  return findAllBooks(where);
};

export const getBookByIdService = async (id) => {
  const book = await findBookById(id);

  if (!book || !book.isActive) {
    throw new AppError("Book not found.", 404);
  }

  return book;
};

export const updateBookService = async (id, data) => {
  const book = await findBookById(id);

  if (!book || !book.isActive) {
    throw new AppError("Book not found.", 404);
  }

  const updateData = { ...data };

  // Check whether the ISBN is already used by another book.
  if (
    updateData.isbn &&
    updateData.isbn.trim() !== book.isbn
  ) {
    const existingBook = await findBookByIsbn(
      updateData.isbn.trim()
    );

    if (existingBook) {
      throw new AppError(
        "A book with this ISBN already exists.",
        409
      );
    }

    updateData.isbn = updateData.isbn.trim();
  }

  // Validate the category if it is being changed.
  if (updateData.categoryId !== undefined) {
    const category = await findCategoryById(
      updateData.categoryId
    );

    if (!category) {
      throw new AppError("Category not found.", 404);
    }
  }

  // Preserve the number of copies already issued.
  if (updateData.totalCopies !== undefined) {
    const issuedCopies =
      book.totalCopies - book.availableCopies;

    if (updateData.totalCopies < issuedCopies) {
      throw new AppError(
        "Total copies cannot be less than the number of issued copies.",
        400
      );
    }

    updateData.availableCopies =
      updateData.totalCopies - issuedCopies;
  }

  return updateBook(id, updateData);
};

export const deactivateBookService = async (id) => {
  const book = await findBookById(id);

  if (!book || !book.isActive) {
    throw new AppError("Book not found.", 404);
  }

  if (book.availableCopies !== book.totalCopies) {
    throw new AppError(
      "Cannot deactivate a book while copies are issued.",
      409
    );
  }

  return deactivateBook(id);
};
