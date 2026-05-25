'use client';

import Link from 'next/link';

interface TermsConsentModalProps {
  open: boolean;
  onAccept: () => void;
}

export function TermsConsentModal({ open, onAccept }: TermsConsentModalProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
    >
      <div className="relative max-w-lg rounded-2xl border border-glow/20 bg-ink/95 p-8 text-cream shadow-[0_0_60px_rgba(232,169,106,0.15)]">
        <h2
          id="terms-modal-title"
          className="font-mincho text-[22px] tracking-[0.08em] text-paper"
        >
          ご利用にあたって
        </h2>
        <div className="mt-5 space-y-4 text-[13px] leading-[1.9] text-cream/75">
          <p>
            アップロードできるのは、利用者自身が権利を有するテキスト、著作権の保護期間が満了したテキスト、または権利者から利用許諾を得たテキストに限ります。
          </p>
          <p>
            第三者の著作物を権利者の許可なくアップロードすること、DRM・コピーガードを回避して作成したテキストを利用すること、違法に入手したテキストを利用することは禁止します。
          </p>
          <p>
            アップロードされたテキストは利用者のブラウザ内で処理され、当サービスのサーバーには保存されません。
          </p>
        </div>
        <div className="mt-7 flex items-center justify-between gap-4">
          <Link
            href="/terms"
            className="font-roman text-[12px] tracking-[0.2em] text-glow/80 hover:text-glow"
          >
            利用規約全文 →
          </Link>
          <button
            type="button"
            onClick={onAccept}
            className="rounded-full border border-glow/40 bg-glow/[0.08] px-7 py-3 font-mincho text-[14px] tracking-[0.2em] text-bright transition-colors hover:bg-glow/[0.15]"
          >
            同意して続ける
          </button>
        </div>
      </div>
    </div>
  );
}
