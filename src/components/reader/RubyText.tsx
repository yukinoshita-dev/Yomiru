import type { ReactNode } from "react";
import type { RubyToken } from "@/types";

interface RubyTextProps {
  text: string;
  tokens: RubyToken[];
}

export function RubyText({ text, tokens }: RubyTextProps) {
  const parts: ReactNode[] = [];
  let cursor = 0;
  let key = 0;

  for (const token of tokens) {
    if (token.base.length === 0) continue;
    const idx = text.indexOf(token.base, cursor);
    if (idx === -1) continue;

    if (idx > cursor) {
      parts.push(<span key={key++}>{text.slice(cursor, idx)}</span>);
    }

    if (token.rt) {
      parts.push(
        <ruby key={key++}>
          {token.base}
          <rt>{token.rt}</rt>
        </ruby>,
      );
    } else {
      parts.push(<span key={key++}>{token.base}</span>);
    }

    cursor = idx + token.base.length;
  }

  if (cursor < text.length) {
    parts.push(<span key={key++}>{text.slice(cursor)}</span>);
  }

  return <>{parts}</>;
}
