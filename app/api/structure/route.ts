import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const systemPrompt = `
あなたは起業に詳しいメンターです。
ユーザーが書いた内容をもとに、ChatGPTのように自然な対話をしてください。
会話の中でユーザーの思いや背景を理解し、必要に応じて質問を返してください。

「Why／Who／What／How／Impact」の構造を参考にしつつ、それを直接聞かず、自然な対話で引き出してください。
会話が進んだら、最後にまとめとして構造を出力してください。
  `

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7
    })
  })

  if (!res.ok) {
    const errorText = await res.text()
    console.error('OpenAI API error:', errorText)
    return NextResponse.json({ reply: 'エラー: OpenAI APIへの接続に失敗しました' }, { status: 500 })
  }

  const data = await res.json()
  const reply = data.choices?.[0]?.message?.content || 'エラー：返信が得られませんでした'

  console.log('[GPT返答]', reply)

  return NextResponse.json({ reply })
}
