import Link from 'next/link';

const features = [
  {
    title: '集中',
    description: '文節ごとに中央へ表示して、視線を動かさず読み進められます。',
  },
  {
    title: 'PWA対応',
    description: 'ホーム画面に追加して、アプリのように読書を続けられます。',
  },
  {
    title: '青空文庫対応',
    description: '青空文庫のルビ記法を読みやすく整えて表示します。',
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen bg-black px-6 py-10 text-white">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl flex-col items-center justify-center gap-10 text-center">
        <div>
          <h1 className="text-6xl font-bold tracking-normal sm:text-8xl">
            よみる
          </h1>
          <p className="mt-6 text-base leading-8 text-zinc-300 sm:text-xl">
            文節ごとに読む。目に優しい自動送りリーダー。
          </p>
        </div>

        <div className="grid w-full gap-4 sm:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-lg border border-zinc-800 bg-zinc-950 p-6 text-left"
            >
              <h2 className="text-lg font-semibold text-white">
                {feature.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-400">
                {feature.description}
              </p>
            </article>
          ))}
        </div>

        <Link
          href="/library"
          className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
        >
          ライブラリを開く →
        </Link>

        <p className="text-xs leading-6 text-zinc-500 sm:text-sm">
          Space:再生停止 / 矢印:進む戻る / S:睡眠モード
        </p>
      </section>
    </main>
  );
}
