import { Counter } from "../api/models/CounterSchema";

export const generatePONumber = async (): Promise<string> => {
  const currentYear = new Date().getFullYear();

  // 1. Find the counter for the current year and increment it
  // If it doesn't exist, upsert (create) it starting at 1
  const counter = await Counter.findOneAndUpdate(
    { year: currentYear },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  // 2. Pad the number with leading zeros (at least 5 characters)
  const paddedSeq = counter.seq.toString().padStart(5, "0");

  // 3. Return formatted string: 2026-00001
  return `PO-${currentYear}-${paddedSeq}`;
};
