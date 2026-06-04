"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Flashcard {
  q: string
  a: string
}

export default function FlashcardPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState("")
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleGenerate = async () => {
    if (!file && !text.trim()) {
      setError("Upload file atau isi teks dulu")
      return
    }

    setLoading(true)
    setError("")
    setFlashcards([])
    setIndex(0)
    setFlipped(false)

    try {
      const formData = new FormData()
      if (file) formData.append("file", file)
      if (text) formData.append("text", text)

      const res = await fetch("/api/flashcard", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error || "Gagal generate flashcard")
        return
      }

      setFlashcards(data.flashcards)
    } catch (err) {
      setError("Gagal menghubungi server")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const next = () => {
    if (index < flashcards.length - 1) {
      setIndex(index + 1)
      setFlipped(false)
    }
  }

  const prev = () => {
    if (index > 0) {
      setIndex(index - 1)
      setFlipped(false)
    }
  }

  return (
    <div className="min-h-screen bg-pink-50 relative">

      <div className="fixed top-6 right-6 flex gap-4 z-40">
  <button
    onClick={() => router.back()}
    className="text-4xl hover:scale-125 transition-transform duration-200 hover:bg-pink-200 p-2 rounded-lg cursor-pointer"
    title="Kembali"
  >
    ←
  </button>
        <Link
          href="/schedule"
          className="text-4xl hover:scale-125 transition-transform duration-200 hover:bg-pink-200 p-2 rounded-lg"
          title="Schedule"
        >
          🗓️
        </Link>
        <Link
          href="/history"
          className="text-4xl hover:scale-125 transition-transform duration-200 hover:bg-pink-200 p-2 rounded-lg"
          title="History"
        >
          📃
        </Link>
      </div>

      <div className="max-w-4xl mx-auto p-10">
        {/* HEADER */}
        <h1 className="text-4xl font-bold mb-2">📝 AI Flashcard Generator</h1>
        <p className="text-gray-600 mb-8">
          Upload materi atau tempel teks untuk membuat flashcard otomatis dengan AI.
        </p>

        {/* INPUT */}
        <div className="bg-white p-6 rounded-3xl shadow">
          <label className="block text-sm font-semibold mb-2">
            Upload File (PDF/DOCX/PPTX)
          </label>
          <input
            type="file"
            accept=".pdf,.docx,.pptx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mb-4 block w-full border rounded-lg p-2"
          />

          <label className="block text-sm font-semibold mb-2">
            Atau Tempel Teks Materi
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tempel materi di sini..."
            className="w-full h-40 border p-3 rounded-xl"
          />

          {error && (
            <div className="mt-3 bg-red-100 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-4 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Generating..." : "Buat Flashcard"}
          </button>
        </div>

        {/* OUTPUT */}
        {flashcards.length > 0 && (
          <div className="bg-white p-6 rounded-3xl shadow mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Flashcard Preview</h2>
              <span className="text-sm text-gray-500">
                {index + 1} / {flashcards.length}
              </span>
            </div>

            <div
              onClick={() => setFlipped(!flipped)}
              className="cursor-pointer border-2 border-pink-200 p-8 rounded-2xl text-center min-h-48 flex flex-col justify-center transition-all hover:shadow-md"
              style={{ background: flipped ? "#fdf2f8" : "#fff" }}
            >
              {!flipped ? (
                <>
                  <p className="text-xs text-gray-400 mb-3 uppercase tracking-widest">
                    Pertanyaan — klik untuk jawaban
                  </p>
                  <h3 className="text-xl font-bold text-gray-800">
                    {flashcards[index].q}
                  </h3>
                </>
              ) : (
                <>
                  <p className="text-xs text-pink-400 mb-3 uppercase tracking-widest">
                    Jawaban
                  </p>
                  <p className="text-lg text-gray-700">{flashcards[index].a}</p>
                </>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={prev}
                disabled={index === 0}
                className="bg-gray-200 hover:bg-gray-300 disabled:opacity-40 px-5 py-2 rounded-xl font-semibold transition"
              >
                ← Sebelumnya
              </button>
              <button
                onClick={() => setFlipped(!flipped)}
                className="bg-pink-100 text-pink-600 px-5 py-2 rounded-xl font-semibold"
              >
                🔄 Balik Kartu
              </button>
              <button
                onClick={next}
                disabled={index === flashcards.length - 1}
                className="bg-pink-500 hover:bg-pink-600 disabled:opacity-40 text-white px-5 py-2 rounded-xl font-semibold transition"
              >
                Berikutnya →
              </button>
            </div>

            <div className="mt-6 bg-gray-100 rounded-full h-2">
              <div
                className="bg-pink-500 h-2 rounded-full transition-all"
                style={{ width: `${((index + 1) / flashcards.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}