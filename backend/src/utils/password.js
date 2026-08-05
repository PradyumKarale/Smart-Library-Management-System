import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/**
 * Hash a plain-text password
 */
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare plain password with hashed password
 */
export const comparePassword = async (
  plainPassword,
  hashedPassword
) => {
  return bcrypt.compare(
    plainPassword,
    hashedPassword
  );
};