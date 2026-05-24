"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { addBook, findBookBySourceHash } from "@/lib/db/repositories/books";
import { addChunks } from "@/lib/db/repositories/chunks";
import { upsertReadingState } from "@/lib/db/repositories/readingState";
import { getSettings, saveSettings } from "@/lib/db/repositories/settings";
import { parseInWorker } from "@/lib/parsers/runInWorker";
import { segmentInWorker } from "@/lib/segmenter/runInWorker";
import { newId } from "@/lib/utils/id";
import type { Book, Chunk } from "@/types";

const SAMPLES = [
  { path: "/samples/rashomon-akutagawa.aozora.txt", name: "rashomon-akutagawa.aozora.txt" },
  { path: "/samples/chumon-miyazawa.aozora.txt", name: "chumon-miyazawa.aozora.txt" },
  { path: "/samples/kokoro-soseki.aozora.txt", name: "kokoro-soseki.aozora.txt" },
] as const;

async function seedSample(path: string, name: string): Promise<boolean> {
  const res = await fetch(path);
  if (!res.ok) return false;
  const blob = await res.blob();
  const file = new File([blob], name, { type: "text/plain" });

  const parsedBook = await parseInWorker("aozora", file);
  const existing = await findBookBySourceHash(parsedBook.sourceHash);
  if (existing) return false;

  const bookId = newId();
  const rawChunks = await segmentInWorker(parsedBook.sections, "aozora");
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
    format: "aozora",
    importedAt: Date.now(),
    totalChunks: chunks.length,
    sourceHash: parsedBook.sourceHash,
  };

  await addBook(book);
  await addChunks(chunks);
  await upsertReadingState({ bookId, currentIndex: 0, lastReadAt: Date.now() });
  return true;
}

export function useSampleSeeder(onSeeded: () => void) {
  const [seeding, setSeeding] = useState(false);

  const seedAll = useCallback(async (showToast = true) => {
    setSeeding(true);
    let added = 0;
    try {
      for (const sample of SAMPLES) {
        const ok = await seedSample(sample.path, sample.name);
        if (ok) added++;
      }
      await saveSettings({ seededSamples: true });
      if (showToast) {
        if (added > 0) {
          toast.success(`サンプル ${added} 冊を読み込みました`);
        } else {
          toast.info("サンプルはすでに読み込み済みです");
        }
      }
      onSeeded();
    } catch {
      if (showToast) toast.error("サンプルの読み込みに失敗しました");
    } finally {
      setSeeding(false);
    }
  }, [onSeeded]);

  useEffect(() => {
    getSettings().then((s) => {
      if (!s.seededSamples) {
        seedAll(false);
      }
    });
  }, [seedAll]);

  return { seeding, seedAll };
}
