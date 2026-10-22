import test from "node:test";
import assert from "node:assert/strict";
import { calculateFine } from "../../backend/src/modules/issues/fine-calculator.js";

test("returns no fine on the due date", () => {
  assert.equal(calculateFine("2026-10-20T00:00:00.000Z", "2026-10-20T23:59:59.000Z"), 0);
});

test("charges ₹120 per overdue calendar day", () => {
  assert.equal(calculateFine("2026-10-20T00:00:00.000Z", "2026-10-22T00:01:00.000Z"), 240);
});

test("does not charge when returned before due date", () => {
  assert.equal(calculateFine("2026-10-20T00:00:00.000Z", "2026-10-18T12:00:00.000Z"), 0);
});

test("counts calendar days rather than elapsed 24-hour periods", () => {
  assert.equal(calculateFine("2026-10-20T00:00:00.000Z", "2026-10-21T00:00:00.000Z"), 120);
});
