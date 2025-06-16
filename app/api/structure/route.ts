// app/api/structure/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { input } = await req.json();

  const prompt = `
以下の自然文を、構成要素ごとに30文字以内で分解してください。
・各行に1カード
・抽象語は避ける
・ユーザー目線で

"${input}"
`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  });

  const data = await res.json();
  const text = data.choices[0].message.content as string;

  const cards = text
    .split('\n')
    .map(line => line.replace(/^[-・\d\.]*\s*/, '').trim())
    .filter(Boolean);

  return NextResponse.json({ cards });
}
