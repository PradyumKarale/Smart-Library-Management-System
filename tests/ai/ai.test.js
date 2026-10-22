import test from "node:test";
import assert from "node:assert/strict";
import { chatRequestSchema } from "../../backend/src/modules/ai/ai.schema.js";
import { chatWithAssistantService } from "../../backend/src/modules/ai/ai.service.js";

test("AI Schema rejects empty messages", () => {
  assert.throws(() => {
    chatRequestSchema.parse({ message: "" });
  });
});

test("AI Schema validates correct messages and history", () => {
  const valid = chatRequestSchema.parse({
    message: "Recommend books for learning algorithms",
    history: [
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Hi! How can I help you today?" },
    ],
  });
  assert.equal(valid.message, "Recommend books for learning algorithms");
  assert.equal(valid.history.length, 2);
});

test("AI Service returns catalog grounded answers for library rules", async () => {
  const user = {
    id: "usr-stu-1",
    fullName: "Rahul Sharma",
    role: "STUDENT",
    studentProfile: { department: "Computer Science", year: 3 },
  };

  const result = await chatWithAssistantService({
    user,
    message: "What are the borrowing rules?",
  });

  assert.ok(result.reply.includes("14 days"));
  assert.ok(result.reply.includes("3 books"));
});
