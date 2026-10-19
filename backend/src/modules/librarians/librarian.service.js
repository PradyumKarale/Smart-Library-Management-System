
import { AppError } from "../../errors/AppError.js";
import { hashPassword } from "../../utils/password.js";
import { findRoleByName } from "../auth/auth.repository.js";

import {
  findAllLibrarians,
  findLibrarianByUserId,
  findUserByEmail,
  findLibrarianByEmployeeId,
  createLibrarian,
  updateLibrarian,
  updateLibrarianStatus,
} from "./librarian.repository.js";

// List all librarians
export const getAllLibrariansService = async () => {
  return findAllLibrarians();
};

// Get one librarian by User UUID
export const getLibrarianByUserIdService = async (userId) => {
  const librarian = await findLibrarianByUserId(userId);

  if (!librarian) {
    throw new AppError("Librarian not found.", 404);
  }

  return librarian;
};

// Create a librarian account
export const createLibrarianService = async (data) => {
  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    throw new AppError(
      "A user with this email already exists.",
      409
    );
  }

  const existingLibrarian = await findLibrarianByEmployeeId(
    data.employeeId
  );

  if (existingLibrarian) {
    throw new AppError(
      "A librarian with this employee ID already exists.",
      409
    );
  }

  const role = await findRoleByName("LIBRARIAN");

  if (!role) {
    throw new AppError("LIBRARIAN role not found.", 404);
  }

  const passwordHash = await hashPassword(data.password);

  return createLibrarian({
    fullName: data.fullName,
    email: data.email,
    passwordHash,
    employeeId: data.employeeId,
    designation: data.designation,
    phone: data.phone,
    address: data.address,
  });
};

// Update librarian details
export const updateLibrarianService = async (userId, data) => {
  const librarian = await findLibrarianByUserId(userId);

  if (!librarian) {
    throw new AppError("Librarian not found.", 404);
  }

  if (data.email !== undefined) {
    const existingUser = await findUserByEmail(data.email);

    if (existingUser && existingUser.id !== userId) {
      throw new AppError(
        "A user with this email already exists.",
        409
      );
    }
  }

  if (data.employeeId !== undefined) {
    const existingLibrarian = await findLibrarianByEmployeeId(
      data.employeeId
    );

    if (
      existingLibrarian &&
      existingLibrarian.userId !== userId
    ) {
      throw new AppError(
        "A librarian with this employee ID already exists.",
        409
      );
    }
  }

  return updateLibrarian(userId, data);
};

// Activate or deactivate a librarian account
export const updateLibrarianStatusService = async (
  userId,
  isActive
) => {
  const librarian = await findLibrarianByUserId(userId);

  if (!librarian) {
    throw new AppError("Librarian not found.", 404);
  }

  return updateLibrarianStatus(userId, isActive);
};
