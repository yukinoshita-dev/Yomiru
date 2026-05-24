import type { BookFormat } from "@/types";
import type { ParsedBook } from "@/lib/parsers/types";

export interface ParseRequest {
  id: string;
  kind: "parse";
  format: BookFormat;
  file: File;
}

export type ParseResponse =
  | { id: string; ok: true; book: ParsedBook }
  | { id: string; ok: false; error: string };
