import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "@/lib/db/database";
import {
  addBookmark,
  isBookmarked,
  listAllBookmarks,
  listBookmarksByBook,
  removeBookmark,
  removeBookmarksByBook,
} from "@/lib/db/repositories/bookmarks";

describe("bookmarks repository", () => {
  beforeEach(async () => {
    await db.delete();
    await db.open();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    db.close();
  });

  it("adds a bookmark and lists bookmarks by book in chunk order", async () => {
    vi.spyOn(Date, "now").mockReturnValue(100);

    const bookmark = await addBookmark("book-1", 2, "しおりにした文節");

    expect(bookmark).toEqual({
      id: "book-1:2",
      bookId: "book-1",
      chunkIndex: 2,
      excerpt: "しおりにした文節",
      createdAt: 100,
    });
    await expect(listBookmarksByBook("book-1")).resolves.toEqual([bookmark]);
  });

  it("removes a bookmark", async () => {
    await addBookmark("book-1", 1, "削除する文節");

    await removeBookmark("book-1", 1);

    await expect(isBookmarked("book-1", 1)).resolves.toBe(false);
  });

  it("lists all bookmarks by createdAt descending", async () => {
    const old = { id: "book-1:0", bookId: "book-1", chunkIndex: 0, excerpt: "古い文節", createdAt: 100 };
    const newest = { id: "book-2:0", bookId: "book-2", chunkIndex: 0, excerpt: "新しい文節", createdAt: 300 };
    const middle = { id: "book-3:0", bookId: "book-3", chunkIndex: 0, excerpt: "中間の文節", createdAt: 200 };
    await db.bookmarks.bulkPut([old, newest, middle]);

    await expect(listAllBookmarks()).resolves.toEqual([newest, middle, old]);
    await expect(listAllBookmarks(2)).resolves.toEqual([newest, middle]);
  });

  it("removes only bookmarks for a target book", async () => {
    const target = await addBookmark("book-1", 0, "対象の文節");
    await addBookmark("book-1", 1, "対象の別文節");
    const other = await addBookmark("book-2", 0, "別書籍の文節");

    await removeBookmarksByBook("book-1");

    await expect(listBookmarksByBook("book-1")).resolves.toEqual([]);
    await expect(listBookmarksByBook("book-2")).resolves.toEqual([other]);
    await expect(isBookmarked(target.bookId, target.chunkIndex)).resolves.toBe(false);
  });
});
