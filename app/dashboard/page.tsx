"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function Dashboard() {
  const [name, setName] = useState("Mahasiswa")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("learnial_name")
      if (savedName) {
        setName(savedName)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-pink-50">

      {/* Header */}
      <nav className="bg-yellow-100 px-8 py-5 shadow">

        <div className="flex justify-between items-center">

          <div>
            <h1 className="text-3xl font-bold text-pink-500">
              🎓 Learnial
            </h1>

            <p className="text-gray-600">
              Belajar Lebih Cerdas, Jadwal Lebih Rapi
            </p>
          </div>

          <div className="text-right">
            <p className="font-semibold">
              Selamat Datang 👋 {name}
            </p>
          </div>

        </div>

      </nav>

      {/* Main Content */}
      <div className="p-10">

        <h2 className="text-4xl font-bold mb-3">
          Dashboard
        </h2>

        <p className="text-gray-600 mb-10">
          Tingkatkan produktivitas belajar dan kelola aktivitas akademikmu dalam satu platform.
        </p>

        {/* Statistik */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white rounded-3xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-600">
              Materi Dipelajari
            </h3>
            <p className="text-4xl font-bold text-pink-500 mt-3">
              0
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-600">
              Flashcard Dibuat
            </h3>
            <p className="text-4xl font-bold text-pink-500 mt-3">
              0
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-600">
              Jadwal Aktif
            </h3>
            <p className="text-4xl font-bold text-pink-500 mt-3">
              0
            </p>
          </div>

        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">

          <Link href="/study" className="bg-white p-8 rounded-3xl shadow hover:shadow-xl transition">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-2xl font-bold">AI Study Assistant</h3>
            <p className="mt-3 text-gray-600">
              Upload PDF, DOCX, atau PPT untuk mendapatkan ringkasan, poin penting, quiz otomatis, dan skor pemahaman.
            </p>
          </Link>

          <Link href="/flashcard" className="bg-white p-8 rounded-3xl shadow hover:shadow-xl transition">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-2xl font-bold">Flashcard Generator</h3>
            <p className="mt-3 text-gray-600">
              Ubah materi kuliah menjadi flashcard interaktif untuk membantu proses belajar dan menghafal.
            </p>
          </Link>

          <Link href="/schedule" className="bg-white p-8 rounded-3xl shadow hover:shadow-xl transition">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-2xl font-bold">Smart Schedule & Reminder</h3>
            <p className="mt-3 text-gray-600">
              Upload jadwal kuliah atau tambah kegiatan dan dapatkan pengingat otomatis melalui email.
            </p>
          </Link>

        </div>

      </div>

    </div>
  )
}