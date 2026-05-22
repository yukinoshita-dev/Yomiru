import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yomiru",
  description:
    "\u6587\u7bc0\u3054\u3068\u306b\u8aad\u66f8\u3092\u9032\u3081\u308bPWA\u30ea\u30fc\u30c0\u30fc\u30a2\u30d7\u30ea",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
