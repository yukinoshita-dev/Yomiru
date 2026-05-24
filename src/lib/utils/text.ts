export function normalizeText(input: string): string {
  return input
    .normalize("NFKC")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " "))
    .join("\n");
}
