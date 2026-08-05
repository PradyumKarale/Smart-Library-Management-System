import {
  hashPassword,
  comparePassword,
} from "../../utils/password.js";

import { generateToken } from "../../utils/jwt.js";
import { MESSAGES } from "../../constants/messages.js";
import { ROLES } from "../../constants/roles.js";
import { AppError } from "../../errors/AppError.js";
import { toSafeUser } from "./auth.mapper.js";
import {
  findUserByEmail,
  findRoleByName,
  createUser,
  findActiveUserByEmail,
} from "./auth.repository.js";

/**
 * Register Student
 */
export const registerStudent = async (data) => {
  // 1. Check if email already exists
  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    throw new AppError(
      MESSAGES.AUTH.EMAIL_EXISTS,
      409
    );
  }

  // 2. Get STUDENT role
  const role = await findRoleByName(ROLES.STUDENT);

  if (!role) {
    throw new AppError(
      MESSAGES.AUTH.ROLE_NOT_FOUND,
      404
    );
  }

  // 3. Hash password
  const hashedPassword = await hashPassword(data.password);

  // 4. Create user
  const user = await createUser({
    userData: {
      fullName: data.fullName,
      email: data.email,
      passwordHash: hashedPassword,
      roleId: role.id,
    },

    studentProfile: {
      enrollmentNo: data.enrollmentNo,
      department: data.department,
      semester: data.semester,
      year: data.year,
    },
  });

  // 5. Generate JWT
  const token = generateToken({
    id: user.id,
    role: user.role.roleName,
  });

  // 6. Safe user object
  const safeUser = toSafeUser(user);

  return {
    user: safeUser,
    token,
  };
};

/**
 * Login User
 */
export const login = async ({ email, password }) => {
  // 1. Find active user
  const user = await findActiveUserByEmail(email);

  if (!user) {
    throw new AppError(
      MESSAGES.AUTH.INVALID_CREDENTIALS,
      401
    );
  }

  // 2. Compare password
  const isPasswordValid = await comparePassword(
    password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw new AppError(
      MESSAGES.AUTH.INVALID_CREDENTIALS,
      401
    );
  }

  // 3. Generate JWT
  const token = generateToken({
    id: user.id,
    role: user.role.roleName,
  });

  // 4. Safe user object
  const safeUser = toSafeUser(user);

  return {
    user: safeUser,
    token,
  };
};

/**
 * Get Current User
 */
export const getCurrentUser = async (user) => {
  return {
    user: toSafeUser(user),
  };
};