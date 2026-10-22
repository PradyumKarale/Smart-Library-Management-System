export const FINE_PER_DAY_RUPEES = 120;
const DAY_MS = 24 * 60 * 60 * 1000;

export const startOfUtcDay = (date) => new Date(Date.UTC(
  date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()
));

export const calculateFine = (dueDate, returnedAt) => {
  const dueDay = startOfUtcDay(new Date(dueDate));
  const returnDay = startOfUtcDay(new Date(returnedAt));
  const overdueDays = Math.max(0, Math.floor((returnDay - dueDay) / DAY_MS));
  return overdueDays * FINE_PER_DAY_RUPEES;
};
