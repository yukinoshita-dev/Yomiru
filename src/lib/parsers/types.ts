import type { BookFormat } from "@/types";

export interface ParsedSection {
  chapterIndex: number;
  title?: string;
  body: string;
}

export interface ParsedBook {
  title: string;
  author?: string;
  format: BookFormat;
  sections: ParsedSection[];
  sourceHash: string;
}
