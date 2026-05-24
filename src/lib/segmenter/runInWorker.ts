import type { ParsedSection } from "@/lib/parsers/types";
import type { Chunk } from "@/types";
import type { SegmentRequest, SegmentResponse } from "@/workers/segmenter.worker";

let workerInstance: Worker | null = null;

function getWorker(): Worker {
  if (!workerInstance) {
    workerInstance = new Worker(
      new URL("../../workers/segmenter.worker.ts", import.meta.url),
      { type: "module" },
    );
  }
  return workerInstance;
}

export function segmentInWorker(
  sections: ParsedSection[],
  rubyMode: "aozora" | "none",
): Promise<Omit<Chunk, "id" | "bookId">[]> {
  return new Promise((resolve, reject) => {
    const id = crypto.randomUUID();
    const worker = getWorker();

    const handler = (event: MessageEvent<SegmentResponse>) => {
      if (event.data.id !== id) return;
      worker.removeEventListener("message", handler);
      if (event.data.ok) {
        resolve(event.data.chunks);
      } else {
        reject(new Error(event.data.error));
      }
    };

    worker.addEventListener("message", handler);

    const request: SegmentRequest = { id, kind: "segment", sections, rubyMode };
    worker.postMessage(request);
  });
}
