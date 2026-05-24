import { parseAozora } from "@/lib/parsers/aozora";
import { parseEpub } from "@/lib/parsers/epub";
import { parseTxt } from "@/lib/parsers/txt";
import type { ParseRequest, ParseResponse } from "./messages";

self.onmessage = async (event: MessageEvent<ParseRequest>) => {
  const { id, format, file } = event.data;
  try {
    let book;
    if (format === "epub") {
      book = await parseEpub(file);
    } else if (format === "aozora") {
      book = await parseAozora(file);
    } else {
      book = await parseTxt(file);
    }
    const response: ParseResponse = { id, ok: true, book };
    self.postMessage(response);
  } catch (err) {
    const response: ParseResponse = {
      id,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
    self.postMessage(response);
  }
};
