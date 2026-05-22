export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-6 py-12 text-[#18181b]">
      <section className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-4xl flex-col items-center justify-center text-center">
        <p className="mb-4 text-sm font-semibold uppercase text-[#0f766e]">
          PWA Reader
        </p>
        <h1 className="text-4xl font-bold tracking-normal sm:text-6xl">
          {"Yomiru - \u6587\u7bc0\u30ea\u30fc\u30c0\u30fc"}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-[#3f3f46] sm:text-lg">
          {
            "\u6587\u7bc0\u3054\u3068\u306b\u8aad\u3080\u305f\u3081\u306ePWA\u30ea\u30fc\u30c0\u30fc"
          }
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#52525b] sm:text-base">
          {
            "\u96fb\u5b50\u66f8\u7c4d\u3092\u77ed\u3044\u5358\u4f4d\u3067\u8868\u793a\u3057\u3001\u76ee\u306b\u3084\u3055\u3057\u304f\u8aad\u307f\u9032\u3081\u308b\u305f\u3081\u306e"
          }
          Yomiru{" "}
          {
            "\u30d7\u30ed\u30b8\u30a7\u30af\u30c8\u3092\u3053\u3053\u304b\u3089\u80b2\u3066\u307e\u3059\u3002"
          }
        </p>
        <div className="mt-10 grid w-full max-w-2xl gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-[#d4d4d8] bg-white p-5 text-left shadow-sm">
            <p className="text-sm font-semibold text-[#0f766e]">Focus</p>
            <p className="mt-2 text-sm leading-6 text-[#52525b]">
              {"1\u6587\u7bc0\u305a\u3064\u4e2d\u592e\u306b\u8868\u793a"}
            </p>
          </div>
          <div className="rounded-lg border border-[#d4d4d8] bg-white p-5 text-left shadow-sm">
            <p className="text-sm font-semibold text-[#b45309]">PWA</p>
            <p className="mt-2 text-sm leading-6 text-[#52525b]">
              {
                "\u5f8c\u7d9a\u30bf\u30b9\u30af\u3067\u30aa\u30d5\u30e9\u30a4\u30f3\u5bfe\u5fdc"
              }
            </p>
          </div>
          <div className="rounded-lg border border-[#d4d4d8] bg-white p-5 text-left shadow-sm">
            <p className="text-sm font-semibold text-[#4338ca]">Library</p>
            <p className="mt-2 text-sm leading-6 text-[#52525b]">
              {
                "\u6b21\u306b\u66f8\u7c4d\u4e00\u89a7\u3078\u63a5\u7d9a\u4e88\u5b9a"
              }
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
