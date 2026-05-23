import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { db } from "@/lib/db/database";
import { getReadingState, upsertReadingState } from "@/lib/db/repositories";
import type { ReadingState } from "@/types";

const state = (currentIndex: number, lastReadAt: number): ReadingState => ({
  bookId: "book-1",
  currentIndex,
  lastReadAt,
  speedSetting: 1.2,
});

describe("readingState repository", () => {
  beforeEach(async () => {
    await db.delete();
    await db.open();
  });

  afterAll(() => {
    db.close();
  });

  it("inserts a reading state", async () => {
    const id = await upsertReadingState(state(1, 100));

    expect(id).toBe("book-1");
    await expect(getReadingState("book-1")).resolves.toEqual(state(1, 100));
  });

  it("updates an existing reading state", async () => {
    await upsertReadingState(state(1, 100));
    await upsertReadingState(state(4, 300));

    await expect(getReadingState("book-1")).resolves.toEqual(state(4, 300));
  });
});
