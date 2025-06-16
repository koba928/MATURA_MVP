'use client'

import { useState } from 'react'
import InputForm from '@/components/InputForm'

type Card = {
  text: string
  isEditing: boolean
  isChecked: boolean
}

export default function Home() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (inputText: string) => {
    setLoading(true)

    try {
      const res = await fetch('/api/structure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: inputText }),
      })

      const data = await res.json()

      // 構造化カードに変換
      const newCards: Card[] = data.cards.map((text: string) => ({
        text,
        isEditing: false,
        isChecked: false,
      }))

      setCards(newCards)
    } catch (error) {
      console.error('API error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (index: number) => {
    const newCards = [...cards]
    newCards[index].isEditing = true
    setCards(newCards)
  }

  const handleSave = (index: number, newText: string) => {
    const newCards = [...cards]
    newCards[index].text = newText
    newCards[index].isEditing = false
    setCards(newCards)
  }

  const handleCheck = (index: number) => {
    const newCards = [...cards]
    newCards[index].isChecked = !newCards[index].isChecked
    setCards(newCards)
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
      <InputForm onSubmit={handleSubmit} />

      {loading && <p className="mt-4 text-gray-500">送信中...</p>}

      {cards.length > 0 && (
        <div className="mt-8 w-full max-w-xl space-y-4">
          <h2 className="text-xl font-bold">構造化カード：</h2>
          {cards.map((card, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-xl shadow border border-gray-200 flex flex-col gap-2"
            >
              {card.isEditing ? (
                <>
                  <textarea
                    className="w-full p-2 border rounded"
                    value={card.text}
                    onChange={(e) => {
                      const newCards = [...cards]
                      newCards[index].text = e.target.value
                      setCards(newCards)
                    }}
                  />
                  <button
                    className="self-end bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    onClick={() => handleSave(index, card.text)}
                  >
                    保存
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={card.isChecked}
                      onChange={() => handleCheck(index)}
                    />
                    <span
                      className={
                        card.isChecked
                          ? 'line-through text-gray-400'
                          : 'text-gray-800'
                      }
                    >
                      {card.text}
                    </span>
                  </label>
                  <button
                    className="text-blue-500 text-sm underline"
                    onClick={() => handleEdit(index)}
                  >
                    編集
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
