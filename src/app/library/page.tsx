"use client";

export const dynamic = 'force-dynamic';

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { BookCard } from "@/components/library/BookCard";
import { DeleteDialog } from "@/components/library/DeleteDialog";
import { ImportDropzone } from "@/components/library/ImportDropzone";
import { listAllBookmarks } from "@/lib/db/repositories/bookmarks";
import { deleteBook, getBookById, listBooks } from "@/lib/db/repositories/books";
import { getReadingState } from "@/lib/db/repositories/readingState";
import { useImport } from "@/features/library/useImport";
import { useSampleSeeder } from "@/features/library/useSampleSeeder";
import { Button } from "@/components/ui/Button";
import type { Book, Bookmark, ReadingState } from "@/types";

interface BookWithState {
  book: Book;
  state?: ReadingState;
}

export default function LibraryPage() {
  const [items, setItems] = useState<BookWithState[]>([]);
  const [bookmarks, setBookmarks] = useState<Array<{ bookmark: Bookmark; book?: Book }>>([]);
  const [deleteTarget, setDeleteTarget] = useState<Book | null>(null);

  const loadBooks = useCallback(async () => {
    const books = await listBooks();
    const withStates = await Promise.all(
      books.map(async (book) => ({
        book,
        state: await getReadingState(book.id),
      })),
    );
    setItems(withStates);
  }, []);

  const loadBookmarks = useCallback(async () => {
    const raws = await listAllBookmarks(5);
    const enriched = await Promise.all(
      raws.map(async (bookmark) => ({
        bookmark,
        book: await getBookById(bookmark.bookId),
      })),
    );
    setBookmarks(enriched.filter((entry) => entry.book !== undefined));
  }, []);

  useEffect(() => { loadBooks(); }, [loadBooks]);
  useEffect(() => { loadBookmarks(); }, [loadBookmarks]);

  const { importing, importFile } = useImport(loadBooks);
  const { seeding, seedAll } = useSampleSeeder(loadBooks);

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteBook(deleteTarget.id);
    toast.success(`「${deleteTarget.title}」を削除しました`);
    setDeleteTarget(null);
    loadBooks();
    loadBookmarks();
  }

  return (
    <main className="min-h-screen bg-zinc-900 text-zinc-100 p-4 max-w-2xl mx-auto">
      <Toaster position="top-center" theme="dark" richColors />
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">ライブラリ</h1>
        <nav className="flex gap-4 text-sm text-zinc-400">
          <a href="/settings" className="hover:text-zinc-100 transition-colors">設定</a>
        </nav>
      </header>

      {bookmarks.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-zinc-300 mb-2 tracking-wider">しおり</h2>
          <div className="flex flex-col gap-2">
            {bookmarks.map(({ bookmark, book }) => (
              <Link
                key={bookmark.id}
                href={`/reader/${bookmark.bookId}?at=${bookmark.chunkIndex}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 hover:border-zinc-700 transition-colors"
              >
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs text-zinc-500">{book?.title ?? "（削除済み）"}</span>
                  <span className="text-sm text-zinc-200 truncate">{bookmark.excerpt}</span>
                </div>
                <span className="text-xs text-zinc-500 shrink-0">#{bookmark.chunkIndex + 1}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <ImportDropzone importing={importing} onFile={importFile} />
      <p className="mt-3 text-[11px] leading-[1.8] text-zinc-500">
        アップロードできるのは、ご自身が権利を有するテキスト、著作権の保護期間が満了したテキスト、または権利者から利用許諾を得たテキストのみです。
        <Link href="/terms" className="ml-1 text-zinc-400 underline underline-offset-2 hover:text-zinc-200">
          利用規約
        </Link>
      </p>
      <div className="mt-3 flex justify-end">
        <Button variant="secondary" onClick={() => seedAll()} disabled={seeding}>
          {seeding ? "読み込み中..." : "サンプルを読み込む"}
        </Button>
      </div>

      <section className="mt-6 grid grid-cols-1 gap-4">
        {items.length === 0 && (
          <p className="text-zinc-500 text-center py-8 text-sm">
            まだ書籍がありません。ファイルをインポートしてください。
          </p>
        )}
        {items.map(({ book, state }) => (
          <BookCard
            key={book.id}
            book={book}
            state={state}
            onDelete={(id) => setDeleteTarget(items.find((i) => i.book.id === id)?.book ?? null)}
          />
        ))}
      </section>

      {deleteTarget && (
        <DeleteDialog
          title={deleteTarget.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </main>
  );
}
