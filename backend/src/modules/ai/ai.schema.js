import { z } from "zod";

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1, "Message content cannot be empty").max(2000, "Message content too long"),
});

export const chatRequestSchema = z.object({
  message: z.string().trim().min(1, "Message cannot be empty").max(1000, "Message exceeds 1000 characters limit"),
  history: z.array(chatMessageSchema).max(10, "Conversation history limited to 10 messages").optional().default([]),
});
