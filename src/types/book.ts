export type BookFormat = "txt" | "aozora" | "epub";

export interface Book {
  id: string;
  title: string;
  author?: string;
  format: BookFormat;
  importedAt: number;
  totalChunks: number;
  coverDataUrl?: string;
  sourceHash: string;
}
