import type { BookFormat } from "@/types";
import type { ParsedBook } from "./types";
import type { ParseRequest, ParseResponse } from "@/workers/messages";

let workerInstance: Worker | null = null;

function getWorker(): Worker {
  if (!workerInstance) {
    workerInstance = new Worker(
      new URL("../../workers/parser.worker.ts", import.meta.url),
      { type: "module" },
    );
  }
  return workerInstance;
}

export function parseInWorker(format: BookFormat, file: File): Promise<ParsedBook> {
  return new Promise((resolve, reject) => {
    const id = crypto.randomUUID();
    const worker = getWorker();

    const handler = (event: MessageEvent<ParseResponse>) => {
      if (event.data.id !== id) return;
      worker.removeEventListener("message", handler);
      if (event.data.ok) {
        resolve(event.data.book);
      } else {
        reject(new Error(event.data.error));
      }
    };

    worker.addEventListener("message", handler);

    const request: ParseRequest = { id, kind: "parse", format, file };
    worker.postMessage(request);
  });
}
