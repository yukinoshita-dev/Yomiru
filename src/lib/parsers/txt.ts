import type { ParsedBook } from "./types";
import { normalizeText } from "@/lib/utils/text";

const REPLACEMENT_CHARACTER = "\uFFFD";

export async function parseTxt(file: File): Promise<ParsedBook> {
  const arrayBuffer = await file.arrayBuffer();
  const decodedText = decodeWithFallback(arrayBuffer);
  const sourceHash = await sha256Hex(arrayBuffer);

  return {
    title: removeExtension(file.name),
    format: "txt",
    sourceHash,
    sections: [
      {
        chapterIndex: 0,
        body: normalizeText(decodedText),
      },
    ],
  };
}

function decodeWithFallback(arrayBuffer: ArrayBuffer): string {
  const utf8Text = new TextDecoder("utf-8").decode(arrayBuffer);

  if (!utf8Text.includes(REPLACEMENT_CHARACTER)) {
    return utf8Text;
  }

  return new TextDecoder("shift_jis").decode(arrayBuffer);
}

async function sha256Hex(arrayBuffer: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function removeExtension(fileName: string): string {
  return fileName.replace(/\.[^./\\]*$/, "");
}
