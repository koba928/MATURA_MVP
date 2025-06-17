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
  const [showChoices, setShowChoices] = useState(false)
  const [choices, setChoices] = useState<string[]>([])
  const [isStructureReady, setIsStructureReady] = useState(false)

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

  // ✅ 自動スクロール
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 選択肢を表示するかどうかを判定する関数
  const shouldShowChoices = (content: string) => {
    // 選択肢を含むメッセージかどうかを判定
    const hasChoices = content.includes('- [') || content.includes('1.') || content.includes('①')
    if (hasChoices) {
      // 選択肢を抽出
      const extractedChoices = content
        .split('\n')
        .filter(line => line.includes('- [') || line.includes('1.') || line.includes('①'))
        .map(line => line.replace(/^[-*]\s*\[?\]?\s*/, '').trim())
      setChoices(extractedChoices)
      return true
    }
    return false
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const userMessage: Message = {
      role: 'user',
      content: inputText
    }

    // 送信前にユーザーの発言を反映
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInputText('')
    setLoading(true)
    setShowChoices(false) // 選択肢を非表示

    try {
      const res = await fetch('/api/structure/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages })
      })

      const data = await res.json()

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reply
      }

      setMessages((prev) => [...prev, assistantMessage])
      // 新しいメッセージに選択肢があるかチェック
      setShowChoices(shouldShowChoices(data.reply))

      // 構造化フラグの処理
      if (data.isStructureReady) {
        setIsStructureReady(true)
        // 構造化APIを呼び出す
        const structureRes = await fetch('/api/structure', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [...updatedMessages, assistantMessage] })
        })
        const structureData = await structureRes.json()
        
        // 構造化結果をメッセージとして追加
        setMessages((prev) => [...prev, {
          role: 'assistant',
          content: structureData.reply
        }])
      }
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

  const handleChoice = async (choice: string) => {
    setShowChoices(false)
    setInputText(choice)
    // 選択肢を送信
    const userMessage: Message = {
      role: 'user',
      content: choice
    }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setLoading(true)

    try {
      const res = await fetch('/api/structure/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages })
      })

      const data = await res.json()
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reply
      }
      setMessages((prev) => [...prev, assistantMessage])
      // 新しいメッセージに選択肢があるかチェック
      setShowChoices(shouldShowChoices(data.reply))

      // 構造化フラグの処理
      if (data.isStructureReady) {
        setIsStructureReady(true)
        // 構造化APIを呼び出す
        const structureRes = await fetch('/api/structure', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [...updatedMessages, assistantMessage] })
        })
        const structureData = await structureRes.json()
        
        // 構造化結果をメッセージとして追加
        setMessages((prev) => [...prev, {
          role: 'assistant',
          content: structureData.reply
        }])
      }
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
      {/* 履歴リセット */}
      <div className="flex justify-end mb-2">
        <button
          onClick={() => {
            setMessages([])
            localStorage.removeItem(STORAGE_KEY)
            setShowChoices(false)
          }}
          className="text-sm text-gray-500 hover:text-red-500 underline"
        >
          履歴をリセット
        </button>
      </div>

      {/* メッセージ表示 */}
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

      {/* 選択肢表示 */}
      {showChoices && (
        <div className="flex flex-wrap gap-2 mb-4">
          {choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleChoice(choice)}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
            >
              {choice}
            </button>
          ))}
        </div>
      )}

      {/* 入力フォーム */}
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
