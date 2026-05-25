import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '利用規約 | Yomiru',
  description: 'Yomiru のご利用にあたっての規約・著作権に関する遵守事項。',
};

export default function TermsPage() {
  return (
    <main className="relative min-h-screen bg-ink text-cream font-jp">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <Link
          href="/"
          className="font-roman text-[12px] tracking-[0.3em] text-cream/45 hover:text-cream/75"
        >
          ← よみる
        </Link>
        <h1 className="mt-10 font-mincho text-[36px] tracking-[0.08em] text-paper">
          利用規約
        </h1>
        <p className="mt-2 font-roman text-[12px] tracking-[0.3em] text-cream/45">
          TERMS OF USE
        </p>

        <section className="mt-12 space-y-8 text-[14px] leading-[2] text-cream/80">
          <div>
            <h2 className="font-mincho text-[18px] tracking-[0.08em] text-paper">
              一. アップロードできるテキスト
            </h2>
            <p className="mt-3">
              本機能は、利用者本人が権利を有するテキスト、著作権の保護期間が満了したテキスト、または権利者から利用許諾を得たテキストを、利用者本人の私的利用の範囲で閲覧するためのものです。
              利用者は、アップロードするテキストがこれらの条件を満たすことを保証するものとします。
            </p>
          </div>

          <div>
            <h2 className="font-mincho text-[18px] tracking-[0.08em] text-paper">
              二. 禁止事項
            </h2>
            <p className="mt-3">
              第三者の著作物を権利者の許可なくアップロードすること、DRM・コピーガードを回避して作成したテキストを利用すること、違法に入手したテキストを利用することは禁止します。
            </p>
          </div>

          <div>
            <h2 className="font-mincho text-[18px] tracking-[0.08em] text-paper">
              三. データの取扱い
            </h2>
            <p className="mt-3">
              アップロードされたテキストは利用者のブラウザ内（IndexedDB）で処理・保存され、当サービスのサーバーには送信されません。
              書籍データの管理責任は利用者に帰属します。
            </p>
          </div>

          <div>
            <h2 className="font-mincho text-[18px] tracking-[0.08em] text-paper">
              四. 免責
            </h2>
            <p className="mt-3">
              本サービスは現状のまま提供され、利用者の利用環境による不具合・データ消失について、運営者は責任を負いません。
              本規約に違反するアップロードによって発生した第三者との紛争については、利用者がその責任を負うものとします。
            </p>
          </div>
        </section>

        <p className="mt-16 font-roman text-[11px] tracking-[0.3em] text-cream/40">
          最終更新 / 2026-05-25
        </p>
      </div>
    </main>
  );
}
