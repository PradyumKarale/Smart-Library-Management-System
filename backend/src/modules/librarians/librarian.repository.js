
import prisma from "../../prisma/prisma.js";

const librarianInclude = {
  user: {
    select: {
      id: true,
      fullName: true,
      email: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      role: {
        select: {
          roleName: true,
        },
      },
    },
  },
};

// Get all librarian profiles
export const findAllLibrarians = async () => {
  return prisma.librarianProfile.findMany({
    include: librarianInclude,
    orderBy: {
      id: "asc",
    },
  });
};

// Find a librarian by their User UUID
export const findLibrarianByUserId = async (userId) => {
  return prisma.librarianProfile.findUnique({
    where: { userId },
    include: librarianInclude,
  });
};

// Find an existing user by email
export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
    },
  });
};

// Find a librarian by employee ID
export const findLibrarianByEmployeeId = async (employeeId) => {
  return prisma.librarianProfile.findUnique({
    where: { employeeId },
    select: {
      userId: true,
      employeeId: true,
    },
  });
};

// Create a librarian and their associated User account
export const createLibrarian = async (data) => {
  const {
    fullName,
    email,
    passwordHash,
    employeeId,
    designation,
    phone,
    address,
  } = data;

  return prisma.librarianProfile.create({
    data: {
      employeeId,
      designation,
      phone: phone ?? null,
      address: address ?? null,
      user: {
        create: {
          fullName,
          email,
          passwordHash,
          role: {
            connect: {
              roleName: "LIBRARIAN",
            },
          },
        },
      },
    },
    include: librarianInclude,
  });
};

// Update user details and librarian profile in one transaction
export const updateLibrarian = async (userId, data) => {
  const { fullName, email, ...profileData } = data;

  const userData = {};

  if (fullName !== undefined) userData.fullName = fullName;
  if (email !== undefined) userData.email = email;

  return prisma.$transaction(async (tx) => {
    if (Object.keys(userData).length > 0) {
      await tx.user.update({
        where: { id: userId },
        data: userData,
      });
    }

    if (Object.keys(profileData).length > 0) {
      await tx.librarianProfile.update({
        where: { userId },
        data: profileData,
      });
    }

    return tx.librarianProfile.findUnique({
      where: { userId },
      include: librarianInclude,
    });
  });
};

// Activate or deactivate a librarian account
export const updateLibrarianStatus = async (userId, isActive) => {
  return prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { isActive },
    });

    return tx.librarianProfile.findUnique({
      where: { userId },
      include: librarianInclude,
    });
  });
};
