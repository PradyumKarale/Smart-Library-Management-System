import {
  registerStudent,
  login,
  getCurrentUser,
} from "./auth.service.js";
import { MESSAGES } from "../../constants/messages.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import {
  registerStudentSchema,
  loginSchema,
} from "./index.js";

/**
 * Register Student
 */
export const registerStudentController = asyncHandler(async (req, res) => {
  const data = registerStudentSchema.parse(req.body);

  const result = await registerStudent(data);

  return apiResponse({
    res,
    statusCode: 201,
    message: MESSAGES.AUTH.REGISTER_SUCCESS,
    data: result,
  });
});

/**
 * Login User
 */
export const loginController = asyncHandler(async (req, res) => {
  const data = loginSchema.parse(req.body);

  const result = await login(data);

  return apiResponse({
    res,
    statusCode: 200,
    message: MESSAGES.AUTH.LOGIN_SUCCESS,
    data: result,
  });
});

/**
 * Get Current User
 */
export const getCurrentUserController = asyncHandler(async (req, res) => {
  const result = await getCurrentUser(req.user);

  return apiResponse({
    res,
    statusCode: 200,
    message: "Current user fetched successfully.",
    data: result,
  });
});