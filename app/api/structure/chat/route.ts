import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const systemPrompt = `
あなたは起業メンターです。
ユーザーのアイデアを深掘りするために、自然な対話を行ってください。

以下の指針に従ってください：
- ユーザーが迷っていそうな点には、提案ベースで質問してください。
- Yes / No で答えられる質問も織り交ぜてください。
- ユーザーが書きやすいように、構造的な質問は避け、自然な流れで「Why/Who/What/How/Impact」に沿ってください。

# 出力形式
以下の2つのパターンがあります：

1. 対話を続ける場合：
通常の対話メッセージを出力してください。

2. 構造化に移行する場合：
以下の形式で出力してください：

---
[STRUCTURE_READY]
（ここに構造化の準備ができた理由を簡潔に説明）
---

# 構造化に移行する条件
以下の条件が満たされた場合、[STRUCTURE_READY]フラグを出力してください：
- Why/Who/What/How/Impactの各要素について十分な情報が集まった
- ユーザーの意図や背景が明確になった
- 具体的な実現方法についての議論が進んだ
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

  // 構造化フラグのチェック
  const isStructureReady = reply.includes('[STRUCTURE_READY]')
  const cleanReply = reply.replace('---\n[STRUCTURE_READY]\n', '').replace('\n---', '')

  console.log('[GPT返答]', cleanReply)
  console.log('[構造化準備]', isStructureReady)

  return NextResponse.json({ 
    reply: cleanReply,
    isStructureReady
  })
} 