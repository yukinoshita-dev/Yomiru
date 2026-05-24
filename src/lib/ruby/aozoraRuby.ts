import type { RubyToken } from "@/types";

export interface ParseAozoraRubyResult {
  text: string;
  ruby: RubyToken[];
}

const NOTE_START = "［＃";
const NOTE_END = "］";
const EXPLICIT_START = "｜";
const RUBY_START = "《";
const RUBY_END = "》";
const KANJI_PATTERN = /[一-龠々ヵヶ]/u;

export function parseAozoraRuby(input: string): ParseAozoraRubyResult {
  const text: string[] = [];
  const ruby: RubyToken[] = [];
  let cursor = 0;

  while (cursor < input.length) {
    if (input.startsWith(NOTE_START, cursor)) {
      const noteEnd = input.indexOf(NOTE_END, cursor + NOTE_START.length);
      if (noteEnd === -1) {
        break;
      }
      cursor = noteEnd + NOTE_END.length;
      continue;
    }

    if (input[cursor] === EXPLICIT_START) {
      const parsed = parseExplicitRuby(input, cursor);
      if (parsed === undefined) {
        text.push(input.slice(cursor));
        break;
      }
      text.push(parsed.base);
      ruby.push({ base: parsed.base, rt: parsed.rt });
      cursor = parsed.nextCursor;
      continue;
    }

    if (input[cursor] === RUBY_START) {
      const rubyEnd = input.indexOf(RUBY_END, cursor + RUBY_START.length);
      if (rubyEnd === -1) {
        text.push(input.slice(cursor));
        break;
      }

      const base = findImplicitRubyBase(text.join(""));
      if (base.length > 0) {
        ruby.push({ base, rt: input.slice(cursor + RUBY_START.length, rubyEnd) });
      }
      cursor = rubyEnd + RUBY_END.length;
      continue;
    }

    text.push(input[cursor]);
    cursor += 1;
  }

  return { text: text.join(""), ruby };
}

function parseExplicitRuby(
  input: string,
  cursor: number,
): { base: string; rt: string; nextCursor: number } | undefined {
  const baseStart = cursor + EXPLICIT_START.length;
  const rubyStart = input.indexOf(RUBY_START, baseStart);
  if (rubyStart === -1) {
    return undefined;
  }

  const rubyEnd = input.indexOf(RUBY_END, rubyStart + RUBY_START.length);
  if (rubyEnd === -1) {
    return undefined;
  }

  return {
    base: input.slice(baseStart, rubyStart),
    rt: input.slice(rubyStart + RUBY_START.length, rubyEnd),
    nextCursor: rubyEnd + RUBY_END.length,
  };
}

function findImplicitRubyBase(text: string): string {
  let index = text.length;
  while (index > 0 && KANJI_PATTERN.test(text[index - 1])) {
    index -= 1;
  }

  return text.slice(index);
}
