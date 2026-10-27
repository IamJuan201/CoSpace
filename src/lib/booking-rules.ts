import { HttpError } from "@/lib/http";

export const MIN_BOOKING_HOURS = 1;
export const MAX_BOOKING_HOURS = 4;
export const OPENING_HOUR = 7;
export const CLOSING_HOUR = 21;
export const MAX_ADVANCE_DAYS = 30;
export const MAX_FUTURE_BOOKINGS = 3;
export const MIN_CANCEL_NOTICE_HOURS = 2;

const MS_PER_HOUR = 60 * 60 * 1000;
const MS_PER_DAY = 24 * MS_PER_HOUR;
const BUSINESS_TIMEZONE = process.env.BUSINESS_TIMEZONE?.trim() || "America/Bogota";

interface LocalTime {
  hour: number;
  minute: number;
}

function getLocalTime(date: Date): LocalTime {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BUSINESS_TIMEZONE,
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);

  const read = (type: "hour" | "minute"): number =>
    Number(parts.find((part) => part.type === type)?.value);

  return { hour: read("hour"), minute: read("minute") };
}

function assertBookableDate(start: Date, now: Date): void {
  if (start.getTime() <= now.getTime()) {
    throw new HttpError("No se puede reservar en el pasado", 400);
  }
  if (start.getTime() - now.getTime() > MAX_ADVANCE_DAYS * MS_PER_DAY) {
    throw new HttpError(
      `No se puede reservar con más de ${MAX_ADVANCE_DAYS} días de anticipación`,
      400
    );
  }
}

function getDurationInHours(start: Date, end: Date): number {
  const hours = (end.getTime() - start.getTime()) / MS_PER_HOUR;
  const startsOnTheHour =
    getLocalTime(start).minute === 0 &&
    start.getUTCSeconds() === 0 &&
    start.getUTCMilliseconds() === 0;

  const isValid =
    Number.isInteger(hours) &&
    startsOnTheHour &&
    hours >= MIN_BOOKING_HOURS &&
    hours <= MAX_BOOKING_HOURS;

  if (!isValid) {
    throw new HttpError(
      `La reserva debe durar entre ${MIN_BOOKING_HOURS} y ${MAX_BOOKING_HOURS} horas completas`,
      400
    );
  }
  return hours;
}

function assertWithinOpeningHours(start: Date, hours: number): void {
  const { hour } = getLocalTime(start);
  if (hour < OPENING_HOUR || hour + hours > CLOSING_HOUR) {
    throw new HttpError(
      `Solo se puede reservar entre las ${OPENING_HOUR}:00 y las ${CLOSING_HOUR}:00`,
      400
    );
  }
}

export function validateBookingWindow(start: Date, end: Date, now: Date = new Date()): number {
  assertBookableDate(start, now);
  const hours = getDurationInHours(start, end);
  assertWithinOpeningHours(start, hours);
  return hours;
}

export function assertCancellableByUser(startTime: Date, now: Date = new Date()): void {
  if (startTime.getTime() - now.getTime() < MIN_CANCEL_NOTICE_HOURS * MS_PER_HOUR) {
    throw new HttpError(
      `Solo puedes cancelar hasta ${MIN_CANCEL_NOTICE_HOURS} horas antes del inicio`,
      409
    );
  }
}