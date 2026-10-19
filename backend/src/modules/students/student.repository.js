
import prisma from "../../prisma/prisma.js";

const studentInclude = {
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

// Get all student profiles
export const findAllStudents = async () => {
  return prisma.studentProfile.findMany({
    include: studentInclude,
    orderBy: {
      id: "asc",
    },
  });
};

// Find a student by their User UUID
export const findStudentByUserId = async (userId) => {
  return prisma.studentProfile.findUnique({
    where: { userId },
    include: studentInclude,
  });
};

// Find a user by email for duplicate checking
export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
    },
  });
};

// Find a student profile by enrollment number
export const findStudentByEnrollmentNo = async (enrollmentNo) => {
  return prisma.studentProfile.findUnique({
    where: { enrollmentNo },
    select: {
      userId: true,
      enrollmentNo: true,
    },
  });
};

// Update user details and student profile in one transaction
export const updateStudent = async (userId, data) => {
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
      await tx.studentProfile.update({
        where: { userId },
        data: profileData,
      });
    }

    return tx.studentProfile.findUnique({
      where: { userId },
      include: studentInclude,
    });
  });
};

// Activate or deactivate a student account
export const updateStudentStatus = async (userId, isActive) => {
  return prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { isActive },
    });

    return tx.studentProfile.findUnique({
      where: { userId },
      include: studentInclude,
    });
  });
};