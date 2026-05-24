"use client";

import { useCallback, useEffect, useState } from "react";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { BookCard } from "@/components/library/BookCard";
import { DeleteDialog } from "@/components/library/DeleteDialog";
import { ImportDropzone } from "@/components/library/ImportDropzone";
import { deleteBook, listBooks } from "@/lib/db/repositories/books";
import { getReadingState } from "@/lib/db/repositories/readingState";
import { useImport } from "@/features/library/useImport";
import { useSampleSeeder } from "@/features/library/useSampleSeeder";
import { Button } from "@/components/ui/Button";
import type { Book, ReadingState } from "@/types";

interface BookWithState {
  book: Book;
  state?: ReadingState;
}

export default function LibraryPage() {
  const [items, setItems] = useState<BookWithState[]>([]);
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

  useEffect(() => { loadBooks(); }, [loadBooks]);

  const { importing, importFile } = useImport(loadBooks);
  const { seeding, seedAll } = useSampleSeeder(loadBooks);

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteBook(deleteTarget.id);
    toast.success(`「${deleteTarget.title}」を削除しました`);
    setDeleteTarget(null);
    loadBooks();
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

      <ImportDropzone importing={importing} onFile={importFile} />
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
