"use client";

import Link from "next/link";
import type { Book } from "@/types";
import type { ReadingState } from "@/types";

interface BookCardProps {
  book: Book;
  state?: ReadingState;
  onDelete: (id: string) => void;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("ja-JP", { month: "short", day: "numeric" });
}

export function BookCard({ book, state, onDelete }: BookCardProps) {
  const progress = state && book.totalChunks > 0
    ? Math.round((state.currentIndex / book.totalChunks) * 100)
    : 0;

  return (
    <div className="bg-zinc-800 rounded-xl p-4 flex flex-col gap-3">
      <Link href={`/reader/${book.id}`} className="flex gap-3 group">
        {book.coverDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={book.coverDataUrl} alt={book.title} className="w-14 h-20 object-cover rounded" />
        ) : (
          <div className="w-14 h-20 bg-zinc-700 rounded flex items-center justify-center text-zinc-500 text-xs">
            {book.format.toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-zinc-100 truncate group-hover:text-indigo-300 transition-colors">
            {book.title}
          </p>
          {book.author && <p className="text-zinc-400 text-sm truncate">{book.author}</p>}
          <p className="text-zinc-500 text-xs mt-1">{book.totalChunks}文節</p>
          {state && (
            <p className="text-zinc-500 text-xs">{progress}% · {formatDate(state.lastReadAt)}</p>
          )}
        </div>
      </Link>
      <div className="flex justify-end">
        <button
          onClick={() => onDelete(book.id)}
          className="text-zinc-500 hover:text-red-400 text-xs transition-colors"
        >
          削除
        </button>
      </div>
    </div>
  );
}
