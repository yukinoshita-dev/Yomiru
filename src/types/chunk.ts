export interface RubyToken {
  base: string;
  rt?: string;
}

export interface Chunk {
  id: string;
  bookId: string;
  index: number;
  text: string;
  ruby?: RubyToken[];
  chapterIndex?: number;
}
