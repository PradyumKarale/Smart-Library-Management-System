import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { chatRequestSchema } from "./ai.schema.js";
import { chatWithAssistantService } from "./ai.service.js";

export const chatController = asyncHandler(async (req, res) => {
  const { message, history } = chatRequestSchema.parse(req.body);

  const result = await chatWithAssistantService({
    user: req.user,
    message,
    history,
  });

  return apiResponse({
    res,
    statusCode: 200,
    message: "Assistant response generated.",
    data: result,
  });
});
