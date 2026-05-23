import { db } from "@/lib/db/database";
import type { ReadingState } from "@/types";

export const upsertReadingState = async (
  state: ReadingState,
): Promise<string> => {
  await db.readingState.put(state);
  return state.bookId;
};

export const getReadingState = (
  bookId: string,
): Promise<ReadingState | undefined> => {
  return db.readingState.get(bookId);
};

export const deleteReadingState = async (bookId: string): Promise<void> => {
  await db.readingState.delete(bookId);
};
