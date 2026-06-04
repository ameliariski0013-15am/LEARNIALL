"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [name, setName] = useState("")

  const handleLogin = () => {
    if (!name.trim()) {
      alert("Nama tidak boleh kosong")
      return
    }

    // simpan nama ke browser
    localStorage.setItem("user_name", name)

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center">

      <div className="bg-white p-10 rounded-3xl shadow-xl w-[420px] text-center">

        <div className="text-7xl mb-3">🎓</div>

        <h1 className="text-4xl font-bold text-pink-500">
          Learnial
        </h1>

        <p className="text-gray-500 mt-2 mb-6">
          Masukkan nama untuk masuk
        </p>

        <input
          type="text"
          placeholder="Nama kamu"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-pink-200 rounded-xl p-3 mb-4"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl"
        >
          Masuk
        </button>

      </div>

    </div>
  )
}