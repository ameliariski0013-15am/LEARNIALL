"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const [name, setName] = useState("")

  const handleStart = () => {
    if (!name.trim()) {
      alert("Nama wajib diisi")
      return
    }

    localStorage.setItem("learnial_name", name)
    router.push("/dashboard")
  }

  return (
    <main className="min-h-screen bg-pink-50 flex items-center justify-center px-6">

      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md text-center">

        {/* ICON */}
        <div className="text-6xl mb-3">🎓</div>

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-pink-500 mb-2">
          Learnial
        </h1>

        {/* DESCRIPTION */}
        <p className="text-gray-600 mb-6">
          Belajar Lebih Cerdas, Jadwal Lebih Rapi
        </p>

        <p className="text-gray-500 text-sm mb-6">
          Platform AI untuk mahasiswa yang membantu merangkum materi, membuat flashcard,
          menguji pemahaman melalui quiz otomatis, membaca jadwal kuliah dari gambar,
          dan mengirim pengingat sebelum kelas dimulai.
        </p>

        {/* INPUT NAMA */}
        <input
          type="text"
          placeholder="Masukkan nama (wajib)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-pink-200 rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-pink-300"
        />

        {/* BUTTON */}
        <button
          onClick={handleStart}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl transition"
        >
          Mulai Sekarang
        </button>

      </div>

    </main>
  )
}
