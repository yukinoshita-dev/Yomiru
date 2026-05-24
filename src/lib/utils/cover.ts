const COVER_COLORS = [
  "#1e1b4b",
  "#1c1917",
  "#064e3b",
  "#4c0519",
  "#0c4a6e",
  "#3b0764",
];

function hashTitle(title: string): number {
  return Array.from(title).reduce((hash, char) => {
    return (hash * 31 + char.codePointAt(0)!) >>> 0;
  }, 0);
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function splitTitle(title: string): string[] {
  const chars = Array.from(title.trim() || "Untitled");
  const lines = [chars.slice(0, 8), chars.slice(8, 16)];

  return lines
    .filter((line) => line.length > 0)
    .map((line) => escapeXml(line.join("")));
}

export function generateCoverDataUrl(title: string, author?: string): string {
  const background = COVER_COLORS[hashTitle(title) % COVER_COLORS.length];
  const titleLines = splitTitle(title);
  const titleStartY = titleLines.length === 1 ? 78 : 68;
  const authorText = author?.trim();

  const titleSvg = titleLines
    .map((line, index) => {
      const y = titleStartY + index * 20;
      return `<text x="56" y="${y}" text-anchor="middle" dominant-baseline="middle" fill="#f8fafc" font-family="serif" font-size="14" font-weight="700">${line}</text>`;
    })
    .join("");

  const authorSvg = authorText
    ? `<text x="56" y="138" text-anchor="middle" dominant-baseline="middle" fill="#cbd5e1" font-family="sans-serif" font-size="9">${escapeXml(authorText)}</text>`
    : "";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="112" height="160" viewBox="0 0 112 160"><rect width="112" height="160" fill="${background}"/>${titleSvg}${authorSvg}</svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
