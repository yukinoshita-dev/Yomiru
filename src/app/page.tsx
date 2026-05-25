'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { TermsConsentModal } from '@/components/TermsConsentModal';
import { KOKORO_BUNSETSU } from '@/data/bunsetsu';
import { useBunsetsuCycle } from '@/hooks/useBunsetsuCycle';
import { useTermsConsent } from '@/hooks/useTermsConsent';

export default function Home() {
  const bunsetsu = KOKORO_BUNSETSU;
  const [idx] = useBunsetsuCycle({ total: bunsetsu.length, intervalMs: 2600 });
  const { accepted, accept } = useTermsConsent();

  const at = (offset: number) =>
    bunsetsu[(idx + offset + bunsetsu.length) % bunsetsu.length];

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-ink font-jp text-cream">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_700px_800px_at_50%_38%,rgba(232,169,106,0.22),rgba(232,169,106,0.06)_40%,transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_240px_at_50%_40%,rgba(255,210,150,0.10),transparent_70%)]"
      />

      <header className="relative z-10 flex items-start justify-between px-12 py-8">
        <div className="flex flex-col gap-0.5">
          <span className="font-mincho text-[26px] tracking-[0.08em] text-paper">よみる</span>
          <span className="font-roman text-[11px] tracking-[0.42em] text-cream/45">YOMIRU</span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-glow/20 bg-glow/[0.03] px-3.5 py-2 text-[11px] tracking-[0.18em] text-cream/60">
          <span
            aria-hidden
            className="h-1.5 w-1.5 animate-andon-pulse rounded-full bg-glow shadow-[0_0_12px_var(--color-glow),0_0_24px_rgba(232,169,106,0.4)]"
          />
          <span>再生中</span>
          <span className="opacity-40">·</span>
          <span className="font-roman text-[13px] tracking-[0.1em]">
            {String(idx + 1).padStart(2, '0')}
            <span className="opacity-50"> / {String(bunsetsu.length).padStart(2, '0')}</span>
          </span>
        </div>
      </header>

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-0 pb-12 pt-8 min-h-[640px]">
        <div
          className="flex max-h-[60vh] items-center gap-6 font-mincho"
          style={{ writingMode: 'vertical-rl' }}
        >
          <div className="shrink-0 whitespace-nowrap text-[18px] tracking-[0.08em] text-cream/15">{at(-2)}</div>
          <div className="shrink-0 whitespace-nowrap text-[22px] tracking-[0.08em] text-cream/30">{at(-1)}</div>
          <div
            key={idx}
            className="shrink-0 animate-andon-reveal whitespace-nowrap text-[48px] font-medium tracking-[0.06em] text-bright [text-shadow:_0_0_30px_rgba(232,169,106,0.55),_0_0_80px_rgba(232,169,106,0.22)]"
          >
            {at(0)}
          </div>
          <div className="shrink-0 whitespace-nowrap text-[22px] tracking-[0.08em] text-cream/30">{at(1)}</div>
          <div className="shrink-0 whitespace-nowrap text-[18px] tracking-[0.08em] text-cream/15">{at(2)}</div>
        </div>

        <div className="writing-vrl absolute left-16 top-1/2 flex -translate-y-1/2 items-center gap-7">
          <div className="font-mincho text-[17px] tracking-[0.5em] text-cream/50">文節ごとに、灯のように。</div>
          <div className="font-roman text-[13px] italic tracking-[0.32em] text-glow/50">One phrase, one breath.</div>
        </div>

        <div className="writing-vrl absolute right-16 top-1/2 flex -translate-y-1/2 items-start gap-5 font-mincho text-cream/40">
          <div className="text-[13px] tracking-[0.3em]">夏目漱石</div>
          <div className="text-[13px] tracking-[0.18em]">『こころ』</div>
        </div>
      </main>

      <section className="relative z-10 border-t border-glow/10 px-16">
        <div className="grid grid-cols-3">
          <Feature kanji="一" en="01" title="視線を、動かさない" body="文節ごとに中央へ。仰向けでも横向きでも、目だけが頁をひらく。" />
          <Feature kanji="二" en="02" title="夜に、馴染む" body="行燈のような暖色。深夜の網膜を刺さない、低い灯。" />
          <Feature kanji="三" en="03" title="まどろみへ、降りる" body="睡眠モードがゆっくり減速し、文節は灯火のように落ちる。" last />
        </div>
      </section>

      <footer className="relative z-10 flex items-center justify-between border-t border-glow/10 px-12 pb-8 pt-7">
        <div className="flex items-center gap-2 text-[11px] tracking-[0.14em] text-cream/45">
          <KeyCap>Space</KeyCap>
          <span className="tracking-[0.12em]">再生 / 停止</span>
          <span className="px-1 opacity-30">·</span>
          <KeyCap>← →</KeyCap>
          <span className="tracking-[0.12em]">進む / 戻る</span>
          <span className="px-1 opacity-30">·</span>
          <KeyCap>S</KeyCap>
          <span className="tracking-[0.12em]">睡眠</span>
          <span className="px-2 opacity-30">·</span>
          <Link
            href="/terms"
            className="font-roman text-[11px] tracking-[0.2em] text-cream/50 hover:text-cream/80"
          >
            利用規約
          </Link>
        </div>
        <Link
          href="/library"
          className="flex items-center gap-3.5 rounded-full border border-glow/40 bg-glow/[0.06] px-7 py-3.5 font-mincho text-[15px] tracking-[0.24em] text-bright transition-colors hover:bg-glow/[0.1]"
        >
          <span>ライブラリをひらく</span>
          <span className="font-roman text-base text-glow">→</span>
        </Link>
      </footer>
      <TermsConsentModal open={accepted === false} onAccept={accept} />
    </div>
  );
}

interface FeatureProps {
  kanji: string;
  en: string;
  title: string;
  body: string;
  last?: boolean;
}

function Feature({ kanji, en, title, body, last }: FeatureProps) {
  return (
    <div className={'flex flex-col gap-4 pb-9 pr-8 pt-10' + (last ? '' : ' border-r border-glow/[0.08]')}>
      <div className="flex items-baseline gap-4">
        <span className="font-mincho text-[56px] leading-none text-glow/70">{kanji}</span>
        <span className="font-roman text-sm tracking-[0.3em] text-cream/35">{en}</span>
      </div>
      <div className="font-mincho text-[22px] tracking-[0.06em] text-paper">{title}</div>
      <div className="text-[13px] leading-[1.9] tracking-[0.04em] text-cream/55">{body}</div>
    </div>
  );
}

function KeyCap({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded border border-glow/25 bg-glow/[0.04] px-2 py-0.5 font-roman text-xs tracking-[0.1em] text-cream/75">
      {children}
    </span>
  );
}
