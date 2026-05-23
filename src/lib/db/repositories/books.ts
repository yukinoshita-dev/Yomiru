import { db } from "@/lib/db/database";
import type { Book } from "@/types";

export const addBook = async (book: Book): Promise<string> => {
  await db.books.put(book);
  return book.id;
};

export const getBookById = (id: string): Promise<Book | undefined> => {
  return db.books.get(id);
};

export const listBooks = (): Promise<Book[]> => {
  return db.books.orderBy("importedAt").reverse().toArray();
};

export const updateBook = (id: string, patch: Partial<Book>): Promise<number> => {
  return db.books.update(id, patch);
};

export const deleteBook = async (id: string): Promise<void> => {
  await db.transaction("rw", db.books, db.chunks, db.readingState, async () => {
    await db.books.delete(id);
    await db.chunks.where("bookId").equals(id).delete();
    await db.readingState.delete(id);
  });
};

export const findBookBySourceHash = (hash: string): Promise<Book | undefined> => {
  return db.books.where("sourceHash").equals(hash).first();
};
