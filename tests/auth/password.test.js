import { hashPassword, comparePassword } from "../../backend/src/utils/password.js";

const run = async () => {
  const password = "Library@123";

  const hashed = await hashPassword(password);

  console.log("Original Password:", password);
  console.log("Hashed Password:", hashed);

  const match = await comparePassword(password, hashed);

  console.log("Password Match:", match);
};

run();