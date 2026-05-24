import JSZip from "jszip";
import type { ParsedBook, ParsedSection } from "@/lib/parsers/types";

const XML_MIME = "application/xml";
const XHTML_MIME = "application/xhtml+xml";
const DC_NS = "http://purl.org/dc/elements/1.1/";

export async function parseEpub(file: File): Promise<ParsedBook> {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  const parser = new DOMParser();

  const containerXml = await readZipText(zip, "META-INF/container.xml");
  const containerDoc = parser.parseFromString(containerXml, XML_MIME);
  const opfPath = containerDoc.querySelector("rootfile")?.getAttribute("full-path");

  if (!opfPath) {
    throw new Error("EPUB content.opf path not found");
  }

  const opfXml = await readZipText(zip, opfPath);
  const opfDoc = parser.parseFromString(opfXml, XML_MIME);
  const opfDir = getDirName(opfPath);
  const fallbackTitle = file.name.replace(/\.[^/.]+$/, "");
  const title = getDcText(opfDoc, "title") || fallbackTitle;
  const author = getDcText(opfDoc, "creator") || undefined;
  const manifest = new Map<string, string>();

  for (const item of Array.from(opfDoc.getElementsByTagNameNS("*", "item"))) {
    const id = item.getAttribute("id");
    const href = item.getAttribute("href");

    if (id && href) {
      manifest.set(id, resolveZipPath(opfDir, href));
    }
  }

  const sections: ParsedSection[] = [];

  for (const itemref of Array.from(opfDoc.getElementsByTagNameNS("*", "itemref"))) {
    const idref = itemref.getAttribute("idref");
    const href = idref ? manifest.get(idref) : undefined;

    if (!href) {
      continue;
    }

    const xhtml = await readZipText(zip, href);
    const doc = parser.parseFromString(xhtml, XHTML_MIME);
    const bodyElement = findElementByLocalName(doc, "body");

    if (!bodyElement) {
      continue;
    }

    const bodyClone = bodyElement.cloneNode(true);

    if (!(bodyClone instanceof Element)) {
      continue;
    }

    for (const rt of Array.from(bodyClone.getElementsByTagName("rt"))) {
      rt.remove();
    }

    const body = ((bodyClone as HTMLElement).innerText ?? bodyClone.textContent ?? "").trim();

    if (!body) {
      continue;
    }

    const section: ParsedSection = {
      chapterIndex: sections.length,
      body,
    };
    const sectionTitle = findElementByLocalName(doc, "title")?.textContent?.trim();

    if (sectionTitle) {
      section.title = sectionTitle;
    }

    sections.push(section);
  }

  return {
    title,
    author,
    sections,
    sourceHash: await sha256Hex(arrayBuffer),
    format: "epub",
  };
}

async function readZipText(zip: JSZip, path: string): Promise<string> {
  const file = zip.file(path);

  if (!file) {
    throw new Error(`EPUB file not found: ${path}`);
  }

  return file.async("text");
}

function getDcText(doc: Document, localName: string): string {
  return doc.getElementsByTagNameNS(DC_NS, localName)[0]?.textContent?.trim() ?? "";
}

function findElementByLocalName(parent: ParentNode, localName: string): Element | null {
  return Array.from(parent.querySelectorAll("*")).find((element) => element.localName === localName) ?? null;
}

function getDirName(path: string): string {
  const slashIndex = path.lastIndexOf("/");

  return slashIndex === -1 ? "" : path.slice(0, slashIndex + 1);
}

function resolveZipPath(baseDir: string, href: string): string {
  const path = href.split("#", 1)[0] ?? "";
  const parts = `${baseDir}${path}`.split("/");
  const resolved: string[] = [];

  for (const part of parts) {
    if (!part || part === ".") {
      continue;
    }

    if (part === "..") {
      resolved.pop();
      continue;
    }

    resolved.push(decodeUriPart(part));
  }

  return resolved.join("/");
}

function decodeUriPart(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

async function sha256Hex(arrayBuffer: ArrayBuffer): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", arrayBuffer);

  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
