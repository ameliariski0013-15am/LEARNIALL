'use client'

import { useRouter } from 'next/navigation'
import StudyUploader from '@/components/StudyUploader'
import Link from 'next/link'

export default function StudyPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-pink-50 relative">
      {/* Back Button - Pojok Kiri Atas */}
      <button
        onClick={() => router.push("/dashboard")}
        className="fixed top-6 left-6 text-4xl hover:scale-125 transition-transform duration-200 cursor-pointer z-40"
        title="Kembali ke Dashboard"
      >
        ←
      </button>

      {/* Emoji Navigation Buttons - Pojok Kanan Atas */}
      <div className="fixed top-6 right-6 flex gap-4 z-40">
        <Link
          href="/flashcard"
          className="text-4xl hover:scale-125 transition-transform duration-200 hover:bg-pink-200 p-2 rounded-lg"
          title="Flashcard Generator"
        >
          📝
        </Link>
        <Link
          href="/schedule"
          className="text-4xl hover:scale-125 transition-transform duration-200 hover:bg-pink-200 p-2 rounded-lg"
          title="Schedule Optimizer"
        >
          🗓️
        </Link>
        <Link
          href="/history"
          className="text-4xl hover:scale-125 transition-transform duration-200 hover:bg-pink-200 p-2 rounded-lg"
          title="Riwayat Belajar"
        >
          📃
        </Link>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-4xl mx-auto">
        {/* Title & Subtitle */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-800">
            🎓 AI Study Assistant
          </h1>
          <p className="text-gray-600 mt-2">
            Ringkas materi, generate quiz, dan buat mindmap otomatis dengan AI
          </p>
        </div>

        {/* Study Uploader Component */}
        <StudyUploader />
      </div>
    </div>
  )
}