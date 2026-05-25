import Dexie, { type Table } from "dexie";

import type { AppSettings, Book, Bookmark, Chunk, ReadingState } from "@/types";

export class YomiruDB extends Dexie {
  books!: Table<Book, string>;
  chunks!: Table<Chunk, string>;
  readingState!: Table<ReadingState, string>;
  settings!: Table<AppSettings, AppSettings["id"]>;
  bookmarks!: Table<Bookmark, string>;

  constructor() {
    super("yomiru");

    this.version(1).stores({
      books: "id, importedAt, sourceHash",
      chunks: "id, bookId, [bookId+index], chapterIndex",
      readingState: "bookId, lastReadAt",
      settings: "id",
    });

    this.version(2).stores({
      books: "id, importedAt, sourceHash",
      chunks: "id, bookId, [bookId+index], chapterIndex",
      readingState: "bookId, lastReadAt",
      settings: "id",
      bookmarks: "id, bookId, chunkIndex, createdAt, [bookId+chunkIndex]",
    });
  }
}

export const db = new YomiruDB();
