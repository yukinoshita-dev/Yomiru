import { db } from "@/lib/db/database";
import type { Chunk } from "@/types";

export const addChunks = async (chunks: Chunk[]): Promise<void> => {
  await db.chunks.bulkPut(chunks);
};

export const getChunkAt = (
  bookId: string,
  index: number,
): Promise<Chunk | undefined> => {
  return db.chunks.where("[bookId+index]").equals([bookId, index]).first();
};

export const getChunksByBook = (bookId: string): Promise<Chunk[]> => {
  return db.chunks.where("bookId").equals(bookId).sortBy("index");
};

export const countChunksByBook = (bookId: string): Promise<number> => {
  return db.chunks.where("bookId").equals(bookId).count();
};

export const deleteChunksByBook = (bookId: string): Promise<number> => {
  return db.chunks.where("bookId").equals(bookId).delete();
};
