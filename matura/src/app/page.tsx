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
    <div>
      <h1>Hello, Vercel!</h1>
    </div>
  );
}
