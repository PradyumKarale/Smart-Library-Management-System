import "../setup.js";

import {
  generateToken,
  verifyToken,
} from "../../backend/src/utils/jwt.js";

const payload = {
  id: "123456",
  role: "STUDENT",
};

const token = generateToken(payload);

console.log("Generated Token:\n");
console.log(token);

console.log("\nDecoded Token:\n");
console.log(verifyToken(token));