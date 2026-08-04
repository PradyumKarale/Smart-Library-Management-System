import { registerStudent } from "./auth.service.js";
import { MESSAGES } from "../../constants/messages.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";

export const registerStudentController = asyncHandler(async (req, res) => {
  const result = await registerStudent(req.body);

  return apiResponse({
    res,
    statusCode: 201,
    message: MESSAGES.AUTH.REGISTER_SUCCESS,
    data: result,
  });
});