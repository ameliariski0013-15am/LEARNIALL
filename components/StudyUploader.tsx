'use client'

import { useState } from 'react'

export default function StudyUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const formData = new FormData()

      if (file) {
        formData.append('file', file)
      }
      if (text) {
        formData.append('text', text)
      }

      const response = await fetch('/api/study', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Error tidak diketahui')
        return
      }

      setResult({
        ...data.data,
        metadata: data.metadata,
      })
      setFile(null)
      setText('')

    } catch (err) {
      setError('Gagal menghubungi server')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Upload File (PDF/DOCX/PPTX)
          </label>
          <input
            type="file"
            accept=".pdf,.docx,.pptx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Atau Tempel Teks Materi
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tempel materi di sini..."
            className="w-full border rounded-lg p-3 h-32"
          />
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (!file && !text)}
          className="bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-semibold"
        >
          {loading ? 'Processing...' : 'Ringkas Materi'}
        </button>
      </form>

      {result && (
        <div className="mt-8 space-y-6">
          <section className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2">📋 Ringkasan</h3>
            <p className="text-gray-700">{result.summary}</p>
          </section>

          <section className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2">🎯 Poin Penting</h3>
            <ul className="list-disc list-inside space-y-1">
              {(result?.keyPoints || []).map((point: string, i: number) => (
                <li key={i} className="text-gray-700">{point}</li>
              ))}
            </ul>
          </section>

          <section className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2">🔑 Kata Kunci</h3>
            <div className="flex flex-wrap gap-2">
              {(result?.keywords || []).map((keyword: string, i: number) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </section>

          <section className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2">🗺️ Mindmap</h3>
            <pre className="text-sm whitespace-pre-wrap font-mono">
              {result.mindmap}
            </pre>
          </section>

          <section className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-4">📝 Quiz</h3>

            <div className="mb-6">
              <h4 className="font-semibold text-green-600 mb-3">
                Pilihan Ganda
              </h4>
              {(result?.quiz?.multipleChoice || []).map((q: any, i: number) => (
                <div key={i} className="mb-4 p-3 bg-white rounded border">
                  <p className="font-semibold mb-2">{i + 1}. {q.question}</p>
                  <div className="space-y-1 mb-3">
                    {q.options.map((opt: string, j: number) => (
                      <label key={j} className="flex items-center">
                        <input
                          type="radio"
                          name={`mc_${i}`}
                          className="mr-2"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                  <details className="text-sm text-gray-600">
                    <summary className="cursor-pointer font-semibold text-blue-600">
                      Lihat Jawaban & Penjelasan
                    </summary>
                    <div className="mt-2 p-2 bg-blue-50 rounded">
                      <p><strong>Jawaban:</strong> {q.correctAnswer}</p>
                      <p><strong>Penjelasan:</strong> {q.explanation}</p>
                    </div>
                  </details>
                </div>
              ))}
            </div>

            <div>
              <h4 className="font-semibold text-purple-600 mb-3">
                Essay
              </h4>
              {(result?.quiz?.essay || []).map((q: any, i: number) => (
                <div key={i} className="mb-4 p-3 bg-white rounded border">
                  <p className="font-semibold mb-3">{i + 1}. {q.question}</p>
                  <textarea
                    placeholder="Tulis jawaban Anda..."
                    className="w-full border rounded p-2 mb-3 h-24"
                  />
                  <details className="text-sm text-gray-600">
                    <summary className="cursor-pointer font-semibold text-purple-600">
                      Lihat Jawaban & Penjelasan
                    </summary>
                    <div className="mt-2 p-2 bg-purple-50 rounded">
                      <p><strong>Poin Jawaban Diharapkan:</strong></p>
                      <pre className="whitespace-pre-wrap text-xs">
                        {q.keyAnswer}
                      </pre>
                      <p className="mt-2"><strong>Penjelasan:</strong> {q.explanation}</p>
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </section>

          <p className="text-sm text-gray-500 text-center">
            ⏱️ Processing time: {result?.metadata?.processingTime || "-"} |
            📊 Text length: {result?.metadata?.textLength || 0} karakter
          </p>
        </div>
      )}
    </div>
  )
}