import type { RubyToken } from "@/types";

interface RubyTextProps {
  tokens: RubyToken[];
}

export function RubyText({ tokens }: RubyTextProps) {
  return (
    <>
      {tokens.map((token, i) =>
        token.rt ? (
          <ruby key={i}>
            {token.base}
            <rt>{token.rt}</rt>
          </ruby>
        ) : (
          <span key={i}>{token.base}</span>
        ),
      )}
    </>
  );
}
