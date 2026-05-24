import { describe, expect, it } from "vitest";
import JSZip from "jszip";

import { parseEpub } from "@/lib/parsers/epub";

describe("parseEpub", () => {
  it("parses metadata and spine ordered XHTML sections from an EPUB", async () => {
    const zip = new JSZip();

    zip.file(
      "META-INF/container.xml",
      `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`,
    );
    zip.file(
      "OPS/content.opf",
      `<?xml version="1.0" encoding="UTF-8"?>
<package version="3.0" xmlns="http://www.idpf.org/2007/opf" unique-identifier="bookid">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>テストEPUB</dc:title>
    <dc:creator>著者名</dc:creator>
  </metadata>
  <manifest>
    <item id="chapter-1" href="chapter1.xhtml" media-type="application/xhtml+xml"/>
    <item id="chapter-2" href="chapter2.xhtml" media-type="application/xhtml+xml"/>
  </manifest>
  <spine>
    <itemref idref="chapter-1"/>
    <itemref idref="chapter-2"/>
  </spine>
</package>`,
    );
    zip.file(
      "OPS/chapter1.xhtml",
      `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head><title>第一章</title></head>
  <body><h1>第一章</h1><p>吾輩は<ruby>猫<rt>ねこ</rt></ruby>である。</p></body>
</html>`,
    );
    zip.file(
      "OPS/chapter2.xhtml",
      `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head><title>第二章</title></head>
  <body><h1>第二章</h1><p>名前はまだない。</p></body>
</html>`,
    );

    const content = await zip.generateAsync({ type: "blob", mimeType: "application/epub+zip" });
    const file = new File([content], "test.epub", { type: "application/epub+zip" });

    const parsed = await parseEpub(file);

    expect(parsed.title).toBe("テストEPUB");
    expect(parsed.author).toBe("著者名");
    expect(parsed.format).toBe("epub");
    expect(parsed.sections).toHaveLength(2);
    expect(parsed.sections.map((section) => section.chapterIndex)).toEqual([0, 1]);
    expect(parsed.sections[0]?.body).toContain("吾輩は猫である。");
  });
});
