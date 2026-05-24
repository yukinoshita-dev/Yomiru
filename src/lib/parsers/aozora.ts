import type { BookFormat } from "@/types";
import type { ParsedBook, ParsedSection } from "@/lib/parsers/types";

const HEADER_SEPARATOR = "-------";
const FOOTER_MARKER = "底本：";

export async function parseAozora(file: File): Promise<ParsedBook> {
  const arrayBuffer = await file.arrayBuffer();
  const text = decodeText(arrayBuffer);
  const headerText = extractHeaderText(text);
  const contentText = removeFooter(removeHeader(text));
  const metadata = parseMetadata(headerText, file.name);
  const format: BookFormat = "aozora";

  return {
    ...metadata,
    format,
    sections: splitSections(contentText),
    sourceHash: await sha256Hex(arrayBuffer),
  };
}

function decodeText(arrayBuffer: ArrayBuffer): string {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(arrayBuffer);
  } catch {
    return new TextDecoder("shift_jis").decode(arrayBuffer);
  }
}

function extractHeaderText(text: string): string {
  const separatorIndex = text.indexOf(HEADER_SEPARATOR);

  return separatorIndex === -1 ? text : text.slice(0, separatorIndex);
}

function removeHeader(text: string): string {
  const separatorIndex = text.indexOf(HEADER_SEPARATOR);

  if (separatorIndex === -1) {
    return text;
  }

  return text.slice(separatorIndex + HEADER_SEPARATOR.length).replace(/^\r?\n/, "");
}

function removeFooter(text: string): string {
  const footerIndex = text.indexOf(FOOTER_MARKER);

  return footerIndex === -1 ? text : text.slice(0, footerIndex);
}

function parseMetadata(headerText: string, fileName: string): Pick<ParsedBook, "title" | "author"> {
  const lines = headerText.replace(/\r\n/g, "\n").split("\n");
  const firstBlock = lines.slice(0, firstBlankLineIndex(lines)).map((line) => line.trim()).filter(Boolean);
  const title = firstBlock[0] ?? titleFromFileName(fileName);
  const author = firstBlock[1];

  return author === undefined ? { title } : { title, author };
}

function firstBlankLineIndex(lines: string[]): number {
  const index = lines.findIndex((line) => line.trim() === "");

  return index === -1 ? lines.length : index;
}

function titleFromFileName(fileName: string): string {
  return fileName.replace(/\.[^./\\]+$/, "");
}

function splitSections(text: string): ParsedSection[] {
  const headingPattern = /［＃中見出し[^\］]*］([\s\S]*?)［＃中見出し終わり］/g;
  const headings = [...text.matchAll(headingPattern)];

  if (headings.length === 0) {
    return [{ chapterIndex: 0, body: text }];
  }

  const sections: ParsedSection[] = [];
  const firstHeadingIndex = headings[0].index ?? 0;
  const preface = text.slice(0, firstHeadingIndex);

  if (preface.trim() !== "") {
    sections.push({ chapterIndex: 0, body: preface });
  }

  for (let i = 0; i < headings.length; i += 1) {
    const heading = headings[i];
    const nextHeading = headings[i + 1];
    const bodyStart = (heading.index ?? 0) + heading[0].length;
    const bodyEnd = nextHeading?.index ?? text.length;
    const title = heading[1].trim();
    const section: ParsedSection = {
      chapterIndex: sections.length,
      body: text.slice(bodyStart, bodyEnd).replace(/^\r?\n/, ""),
    };

    if (title !== "") {
      section.title = title;
    }

    sections.push(section);
  }

  return sections;
}

async function sha256Hex(arrayBuffer: ArrayBuffer): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", arrayBuffer);

  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
