import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import {
  getAllStudentsService,
  getStudentByUserIdService,
  updateStudentService,
  updateStudentStatusService,
} from "./student.service.js";
import {
  studentUserIdParamSchema,
  updateStudentSchema,
  studentStatusSchema,
} from "./student.schema.js";

// GET all students
export const getAllStudentsController = asyncHandler(
  async (req, res) => {
    const students = await getAllStudentsService();

    return apiResponse({
      res,
      statusCode: 200,
      message: "Students fetched successfully.",
      data: students,
    });
  }
);

// GET one student by User UUID
export const getStudentByUserIdController = asyncHandler(
  async (req, res) => {
    const { userId } = studentUserIdParamSchema.parse(req.params);
    const student = await getStudentByUserIdService(userId);

    return apiResponse({
      res,
      statusCode: 200,
      message: "Student fetched successfully.",
      data: student,
    });
  }
);

// PATCH student details
export const updateStudentController = asyncHandler(
  async (req, res) => {
    const { userId } = studentUserIdParamSchema.parse(req.params);
    const data = updateStudentSchema.parse(req.body);

    const student = await updateStudentService(userId, data);

    return apiResponse({
      res,
      statusCode: 200,
      message: "Student updated successfully.",
      data: student,
    });
  }
);

// PATCH student account status
export const updateStudentStatusController = asyncHandler(
  async (req, res) => {
    const { userId } = studentUserIdParamSchema.parse(req.params);
    const { isActive } = studentStatusSchema.parse(req.body);

    const student = await updateStudentStatusService(
      userId,
      isActive
    );

    return apiResponse({
      res,
      statusCode: 200,
      message: isActive
        ? "Student account activated successfully."
        : "Student account deactivated successfully.",
      data: student,
    });
  }
);