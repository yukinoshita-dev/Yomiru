import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { db } from "@/lib/db/database";
import {
  addBook,
  addBookmark,
  addChunks,
  deleteBook,
  findBookBySourceHash,
  getBookById,
  getChunksByBook,
  getReadingState,
  isBookmarked,
  listBooks,
  upsertReadingState,
} from "@/lib/db/repositories";
import type { Book, Chunk, ReadingState } from "@/types";

const book = (id: string, importedAt: number, sourceHash = `${id}-hash`): Book => ({
  id,
  title: `Book ${id}`,
  format: "txt",
  importedAt,
  totalChunks: 2,
  sourceHash,
});

const chunk = (bookId: string, index: number): Chunk => ({
  id: `${bookId}:${index}`,
  bookId,
  index,
  text: `chunk ${index}`,
});

const readingState = (bookId: string): ReadingState => ({
  bookId,
  currentIndex: 1,
  lastReadAt: 200,
});

describe("books repository", () => {
  beforeEach(async () => {
    await db.delete();
    await db.open();
  });

  afterAll(() => {
    db.close();
  });

  it("adds a book and gets it by id", async () => {
    const id = await addBook(book("book-1", 100));

    await expect(getBookById(id)).resolves.toEqual(book("book-1", 100));
  });

  it("lists books by importedAt descending", async () => {
    await addBook(book("old", 100));
    await addBook(book("new", 300));
    await addBook(book("middle", 200));

    await expect(listBooks()).resolves.toEqual([
      book("new", 300),
      book("middle", 200),
      book("old", 100),
    ]);
  });

  it("finds a book by sourceHash", async () => {
    await addBook(book("book-1", 100, "same-source"));

    await expect(findBookBySourceHash("same-source")).resolves.toEqual(
      book("book-1", 100, "same-source"),
    );
  });

  it("deletes a book with its chunks and reading state", async () => {
    await addBook(book("book-1", 100));
    await addChunks([chunk("book-1", 0), chunk("book-1", 1)]);
    await upsertReadingState(readingState("book-1"));
    await addBookmark("book-1", 1, "bookmarked chunk");

    await deleteBook("book-1");

    await expect(getBookById("book-1")).resolves.toBeUndefined();
    await expect(getChunksByBook("book-1")).resolves.toEqual([]);
    await expect(getReadingState("book-1")).resolves.toBeUndefined();
    await expect(isBookmarked("book-1", 1)).resolves.toBe(false);
  });
});
