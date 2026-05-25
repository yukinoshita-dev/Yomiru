'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ja">
      <body style={{ background: '#0a0807', color: '#e8d9c0', fontFamily: 'system-ui, sans-serif' }}>
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ maxWidth: 480, textAlign: 'center' }}>
            <h1 style={{ fontSize: 24, marginBottom: 16 }}>予期しないエラーが発生しました</h1>
            <p style={{ fontSize: 14, opacity: 0.7, marginBottom: 24 }}>
              {error.message || 'ページの読み込みに失敗しました。'}
            </p>
            <button
              type="button"
              onClick={reset}
              style={{
                padding: '10px 24px',
                background: '#e8a96a',
                color: '#0a0807',
                border: 'none',
                borderRadius: 999,
                cursor: 'pointer',
              }}
            >
              再試行
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
