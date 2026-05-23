import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { db } from "@/lib/db/database";
import {
  addChunks,
  countChunksByBook,
  getChunkAt,
  getChunksByBook,
} from "@/lib/db/repositories";
import type { Chunk } from "@/types";

const chunk = (bookId: string, index: number): Chunk => ({
  id: `${bookId}:${index}`,
  bookId,
  index,
  text: `chunk ${index}`,
});

describe("chunks repository", () => {
  beforeEach(async () => {
    await db.delete();
    await db.open();
  });

  afterAll(() => {
    db.close();
  });

  it("adds chunks and gets a chunk by bookId and index", async () => {
    await addChunks([chunk("book-1", 0), chunk("book-1", 1)]);

    await expect(getChunkAt("book-1", 1)).resolves.toEqual(chunk("book-1", 1));
  });

  it("gets chunks by book in index order", async () => {
    await addChunks([chunk("book-1", 2), chunk("book-1", 0), chunk("book-1", 1)]);

    await expect(getChunksByBook("book-1")).resolves.toEqual([
      chunk("book-1", 0),
      chunk("book-1", 1),
      chunk("book-1", 2),
    ]);
  });

  it("counts chunks by book", async () => {
    await addChunks([chunk("book-1", 0), chunk("book-1", 1), chunk("book-2", 0)]);

    await expect(countChunksByBook("book-1")).resolves.toBe(2);
  });
});
