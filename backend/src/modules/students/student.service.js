import { AppError } from "../../errors/AppError.js";
import {
  findAllStudents,
  findStudentByUserId,
  findUserByEmail,
  findStudentByEnrollmentNo,
  updateStudent,
  updateStudentStatus,
} from "./student.repository.js";

// Get all student records
export const getAllStudentsService = async () => {
  return findAllStudents();
};

// Get one student by User UUID
export const getStudentByUserIdService = async (userId) => {
  const student = await findStudentByUserId(userId);

  if (!student) {
    throw new AppError("Student not found.", 404);
  }

  return student;
};

// Update student details
export const updateStudentService = async (userId, data) => {
  // Ensure the student exists
  const student = await findStudentByUserId(userId);

  if (!student) {
    throw new AppError("Student not found.", 404);
  }

  // Prevent duplicate email addresses
  if (data.email !== undefined) {
    const existingUser = await findUserByEmail(data.email);

    if (existingUser && existingUser.id !== userId) {
      throw new AppError(
        "A user with this email already exists.",
        409
      );
    }
  }

  // Prevent duplicate enrollment numbers
  if (data.enrollmentNo !== undefined) {
    const existingStudent = await findStudentByEnrollmentNo(
      data.enrollmentNo
    );

    if (
      existingStudent &&
      existingStudent.userId !== userId
    ) {
      throw new AppError(
        "A student with this enrollment number already exists.",
        409
      );
    }
  }

  return updateStudent(userId, data);
};

// Activate or deactivate a student account
export const updateStudentStatusService = async (
  userId,
  isActive
) => {
  const student = await findStudentByUserId(userId);

  if (!student) {
    throw new AppError("Student not found.", 404);
  }

  return updateStudentStatus(userId, isActive);
};