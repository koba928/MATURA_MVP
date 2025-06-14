'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false); // ←追加

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // ←Hydrationエラー防止

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">あなたの「やりたいこと」を教えてください</h1>
      {!submitted ? (
        <>
          <textarea
            className="w-full max-w-md h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="例：副業のアイデアを考えてほしい、推しの管理アプリを作りたい など"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={() => setSubmitted(true)}
            className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
          >
            送信する
          </button>
        </>
      ) : (
        <div className="text-center">
          <p className="text-lg font-medium">ありがとうございます！内容を分析しています…</p>
          <p className="mt-2 text-gray-600">「{input}」</p>
        </div>
      )}
    </main>
  );
}
