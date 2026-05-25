import { db } from "@/lib/db/database";
import type { Bookmark } from "@/types";

const makeBookmarkId = (bookId: string, chunkIndex: number) => `${bookId}:${chunkIndex}`;

export async function addBookmark(
  bookId: string,
  chunkIndex: number,
  excerpt: string,
  label?: string,
): Promise<Bookmark> {
  const bookmark: Bookmark = {
    id: makeBookmarkId(bookId, chunkIndex),
    bookId,
    chunkIndex,
    label,
    excerpt: excerpt.slice(0, 60),
    createdAt: Date.now(),
  };
  await db.bookmarks.put(bookmark);
  return bookmark;
}

export async function removeBookmark(bookId: string, chunkIndex: number): Promise<void> {
  await db.bookmarks.delete(makeBookmarkId(bookId, chunkIndex));
}

export async function isBookmarked(bookId: string, chunkIndex: number): Promise<boolean> {
  const bookmark = await db.bookmarks.get(makeBookmarkId(bookId, chunkIndex));
  return !!bookmark;
}

export function listBookmarksByBook(bookId: string): Promise<Bookmark[]> {
  return db.bookmarks.where("bookId").equals(bookId).sortBy("chunkIndex");
}

export async function listAllBookmarks(limit?: number): Promise<Bookmark[]> {
  const all = await db.bookmarks.orderBy("createdAt").reverse().toArray();
  return limit ? all.slice(0, limit) : all;
}

export async function removeBookmarksByBook(bookId: string): Promise<void> {
  await db.bookmarks.where("bookId").equals(bookId).delete();
}
