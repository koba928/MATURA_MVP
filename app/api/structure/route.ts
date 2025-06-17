import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { input } = await req.json()

  const prompt = `
あなたは起業支援AI「MATURA」のアシスタントです。

ユーザーが「やりたいこと」を送ってきたら、以下のステージに従って対話しながら本質を深掘りしてください。

---

【進行ルール】

- 各ステージでは、**ユーザーの回答内容を見て、必要なだけ追加質問をしてもよい**  
- 同じことを繰り返さず、**本質が見えたと思ったら次のステージに進んでください**  
- ユーザーが「わからない」と言ったら、例やヒントを使って誘導してあげてください  
- ステージが切り替わるときは「では次に…」と一言添えてください

---

【ステージ一覧】

① Why(なぜ）  
- なぜこのサービスをやりたいと思ったのか？  
- どんな体験、気づき、問題意識が背景にあるか？

② Who(誰のため）  
- 誰にとって必要なサービスか？  
- 想定ユーザー像を探る。仮でもよい。

③ What(どんな価値）  
- その人にとって、どんな嬉しさ・変化があるか？  
- 感情・体験レベルまで掘る

④ How(どう使う）  
- どんな順番で使うか？  
- どんな機能・UXが必要か?MVPで最小限必要なものは?

⑤ Impact(理想の未来）  
- このサービスで自分や世界がどう変わると良い？  
- 社会的意義や、ビジョン・収益性についても聞いてOK

---

🧾【最後に出力する要約】

- 🎯 やりたい理由(Why)  
- 👤 想定ユーザー(Who)  
- 🎁 提供価値(What)  
- 🛠 機能案(How)  
- 🌏 目指す未来(Impact)  
- 📌 構造化カード一覧(30字以内)

---

※ あくまで「ユーザーの伴走者」として、丁寧に質問し、推測・共感しながら掘り下げてください。
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
        { role: 'system', content: prompt },
        { role: 'user', content: input }
      ],
      temperature: 0.7
    })
  })

  if (!res.ok) {
    const errorText = await res.text()
    console.error('OpenAI API error:', errorText)
    return NextResponse.json({ reply: 'エラー:OpenAI APIへの接続に失敗しました' }, { status: 500 })
  }

  const data = await res.json()
  const reply = data.choices?.[0]?.message?.content || 'エラー：返信が得られませんでした'

  console.log('[GPT返答]', reply)

  return NextResponse.json({ reply })
}
