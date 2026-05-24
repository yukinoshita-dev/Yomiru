import { parseAozoraRuby } from "@/lib/ruby/aozoraRuby";
import { segment } from "@/lib/segmenter/segmenter";
import type { ParsedSection } from "@/lib/parsers/types";
import type { Chunk } from "@/types";

export interface SegmentRequest {
  id: string;
  kind: "segment";
  sections: ParsedSection[];
  rubyMode: "aozora" | "none";
}

export type SegmentResponse =
  | { id: string; ok: true; chunks: Omit<Chunk, "id" | "bookId">[] }
  | { id: string; ok: false; error: string };

self.onmessage = (event: MessageEvent<SegmentRequest>) => {
  const { id, sections, rubyMode } = event.data;
  try {
    let index = 0;
    const chunks: Omit<Chunk, "id" | "bookId">[] = [];

    for (const section of sections) {
      let text = section.body;
      let ruby = undefined;

      if (rubyMode === "aozora") {
        const parsed = parseAozoraRuby(section.body);
        text = parsed.text;
        ruby = parsed.ruby.length > 0 ? parsed.ruby : undefined;
      }

      const segmented = segment({
        text,
        ruby,
        chapterIndex: section.chapterIndex,
      });

      for (const seg of segmented) {
        chunks.push({
          index: index++,
          text: seg.text,
          ruby: seg.ruby,
          chapterIndex: seg.chapterIndex,
        });
      }
    }

    const response: SegmentResponse = { id, ok: true, chunks };
    self.postMessage(response);
  } catch (err) {
    const response: SegmentResponse = {
      id,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
    self.postMessage(response);
  }
};
