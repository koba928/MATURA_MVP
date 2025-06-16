'use client'

import { useState } from 'react'

export default function InputForm({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [inputText, setInputText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return
    onSubmit(inputText)
    setInputText('')
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl flex flex-col gap-4">
      <textarea
        suppressHydrationWarning 
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="やりたいことを自由に書いてください"
        className="w-full h-32 p-4 rounded-xl border border-gray-300 shadow"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl hover:bg-blue-700 transition"
      >
        GPTに送る
      </button>
    </form>
  )
}
