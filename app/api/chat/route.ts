import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  const { messages } = await req.json()

  const chatCompletion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
  })

  const reply = chatCompletion.choices[0].message.content
  return NextResponse.json({ reply })
}
