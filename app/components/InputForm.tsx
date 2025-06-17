'use client'

import { useEffect, useRef, useState } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

const STORAGE_KEY = 'matura_messages'

export default function InputForm() {
  const [inputText, setInputText] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // ✅ 初回マウント時に localStorage から復元
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      setMessages(JSON.parse(saved))
    }
  }, [])

  // ✅ messages が変わるたびに保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const userMessage: Message = {
      role: 'user',
      content: inputText
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText('')
    setLoading(true)

    try {
      const res = await fetch('/api/structure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: inputText })
      })

      const data = await res.json()

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reply
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      console.error(err)
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: 'エラーが発生しました'
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col min-h-screen">
      <div className="flex justify-end mb-2">
  <button
    onClick={() => {
      setMessages([])
      localStorage.removeItem(STORAGE_KEY)
    }}
    className="text-sm text-gray-500 hover:text-red-500 underline"
  >
    履歴をリセット
  </button>
</div>
<div className="flex-1 overflow-y-auto space-y-4 mb-6">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-3 rounded-2xl max-w-sm shadow text-sm whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-900 rounded-bl-none'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 mt-auto">
        <textarea
          className="flex-1 p-2 border rounded resize-none"
          rows={2}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="やりたいこと、または続きの回答を入力"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={loading}
        >
          {loading ? '送信中...' : '送信'}
        </button>
      </form>
    </div>
  )
}
