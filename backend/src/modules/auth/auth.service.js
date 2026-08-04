import { hashPassword } from "../../utils/password.js";
import { generateToken } from "../../utils/jwt.js";
import { MESSAGES } from "../../constants/messages.js";
import { ROLES } from "../../constants/roles.js";
import { AppError } from "../../errors/AppError.js";

import {
  findUserByEmail,
  findRoleByName,
  createUser,
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

const safeUser = {
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  role: user.role.roleName,

  studentProfile: user.studentProfile
    ? {
        enrollmentNo: user.studentProfile.enrollmentNo,
        department: user.studentProfile.department,
        semester: user.studentProfile.semester,
        year: user.studentProfile.year,
      }
    : null,

  librarianProfile: user.librarianProfile
    ? {
        employeeId: user.librarianProfile.employeeId,
      }
    : null,
};

return {
  user: safeUser,
  token,
};
};