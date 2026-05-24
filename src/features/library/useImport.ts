"use client";

import { useState } from "react";
import { toast } from "sonner";
import { addBook, findBookBySourceHash } from "@/lib/db/repositories/books";
import { addChunks } from "@/lib/db/repositories/chunks";
import { upsertReadingState } from "@/lib/db/repositories/readingState";
import { parseInWorker } from "@/lib/parsers/runInWorker";
import { segmentInWorker } from "@/lib/segmenter/runInWorker";
import { newId } from "@/lib/utils/id";
import type { Book, BookFormat, Chunk } from "@/types";

function detectFormat(file: File, preview: string): BookFormat {
  if (file.name.endsWith(".epub")) return "epub";
  if (
    preview.includes("青空文庫") ||
    preview.includes("底本：") ||
    preview.includes("《")
  ) {
    return "aozora";
  }
  return "txt";
}

async function readPreview(file: File): Promise<string> {
  const slice = file.slice(0, 1024);
  const buf = await slice.arrayBuffer();
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(buf);
  } catch {
    return new TextDecoder("shift_jis").decode(buf);
  }
}

export function useImport(onImported: () => void) {
  const [importing, setImporting] = useState(false);

  async function importFile(file: File) {
    setImporting(true);
    try {
      const preview = await readPreview(file);
      const format = detectFormat(file, preview);

      const parsedBook = await parseInWorker(format, file);

      const existing = await findBookBySourceHash(parsedBook.sourceHash);
      if (existing) {
        toast.info(`「${existing.title}」はすでにインポート済みです`);
        return;
      }

      const bookId = newId();
      const rubyMode = format === "aozora" ? "aozora" : "none";
      const rawChunks = await segmentInWorker(parsedBook.sections, rubyMode);

      const chunks: Chunk[] = rawChunks.map((c) => ({
        ...c,
        id: `${bookId}:${c.index}`,
        bookId,
        ruby: c.ruby,
        chapterIndex: c.chapterIndex,
      }));

      const book: Book = {
        id: bookId,
        title: parsedBook.title,
        author: parsedBook.author,
        format,
        importedAt: Date.now(),
        totalChunks: chunks.length,
        sourceHash: parsedBook.sourceHash,
        coverDataUrl: (parsedBook as { coverDataUrl?: string }).coverDataUrl,
      };

      await addBook(book);
      await addChunks(chunks);
      await upsertReadingState({
        bookId,
        currentIndex: 0,
        lastReadAt: Date.now(),
      });

      toast.success(`「${book.title}」をインポートしました（${chunks.length}文節）`);
      onImported();
    } catch (err) {
      toast.error(`インポートに失敗しました: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setImporting(false);
    }
  }

  return { importing, importFile };
}
