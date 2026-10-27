import assert from "node:assert/strict";
import test from "node:test";
import { validateBookingWindow } from "./booking-rules";

const now = new Date("2026-10-27T12:00:00.000Z");

test("accepts a future one-hour booking within business hours", () => {
  const hours = validateBookingWindow(
    new Date("2026-10-28T15:00:00.000Z"),
    new Date("2026-10-28T16:00:00.000Z"),
    now,
  );
  assert.equal(hours, 1);
});

test("rejects booking windows shorter than one full hour", () => {
  assert.throws(
    () => validateBookingWindow(
      new Date("2026-10-28T15:00:00.000Z"),
      new Date("2026-10-28T15:30:00.000Z"),
      now,
    ),
    /horas completas/,
  );
});
