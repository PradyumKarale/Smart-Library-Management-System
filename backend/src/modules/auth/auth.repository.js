import prisma from "../../prisma/prisma.js";

/**
 * Find user by email
 */
export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
    include: {
      role: true,
      studentProfile: true,
      librarianProfile: true,
    },
  });
};

/**
 * Find role by name
 */
export const findRoleByName = async (roleName) => {
  return prisma.role.findUnique({
    where: {
      roleName: roleName,
    },
  });
};

/**
 * Generic user creation
 */
export const createUser = async ({
  userData,
  studentProfile,
  librarianProfile,
}) => {
  return prisma.user.create({
    data: {
      ...userData,

      studentProfile: studentProfile
        ? {
            create: studentProfile,
          }
        : undefined,

      librarianProfile: librarianProfile
        ? {
            create: librarianProfile,
          }
        : undefined,
    },

    include: {
      role: true,
      studentProfile: true,
      librarianProfile: true,
    },
  });
};