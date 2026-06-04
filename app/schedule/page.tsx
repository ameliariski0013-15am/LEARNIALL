"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SchedulePage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [day, setDay] = useState("")
  const [time, setTime] = useState("")
  const [email, setEmail] = useState("")
  const [scheduleList, setScheduleList] = useState<any[]>([])

  const handleSave = () => {
    if (!title || !day || !time) {
      alert("Lengkapi data dulu")
      return
    }

    const newItem = { title, day, time, email }
    setScheduleList([...scheduleList, newItem])
    setTitle("")
    setDay("")
    setTime("")
    setEmail("")
  }

  return (
    <div className="min-h-screen bg-pink-50 relative p-10">

      {/* TOMBOL POJOK KANAN ATAS */}
      <div className="fixed top-6 right-6 flex gap-4 z-40">
  <button
    onClick={() => router.back()}
    className="text-4xl hover:scale-125 transition-transform duration-200 hover:bg-pink-200 p-2 rounded-lg cursor-pointer"
    title="Kembali"
  >
    ←
  </button>
        <Link
          href="/history"
          className="text-4xl hover:scale-125 transition-transform duration-200 hover:bg-pink-200 p-2 rounded-lg"
          title="History"
        >
          📃
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-2">
        📅 Smart Schedule Planner
      </h1>

      <p className="text-gray-600 mb-8">
        Kelola jadwal kuliah dan aktivitasmu.
      </p>

      {/* FORM */}
      <div className="bg-white p-6 rounded-3xl shadow">
        <h2 className="text-2xl font-semibold mb-4">
          Tambah Kegiatan Manual
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nama Kegiatan"
            className="border p-3 rounded-xl"
          />

          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="border p-3 rounded-xl"
          >
            <option value="">Hari</option>
            <option>Senin</option>
            <option>Selasa</option>
            <option>Rabu</option>
            <option>Kamis</option>
            <option>Jumat</option>
            <option>Sabtu</option>
          </select>

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border p-3 rounded-xl"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (opsional)"
            className="border p-3 rounded-xl"
          />
        </div>

        <button
          onClick={handleSave}
          className="mt-6 bg-pink-500 text-white px-6 py-3 rounded-xl"
        >
          Simpan Jadwal
        </button>
      </div>

      {/* LIST */}
      <div className="bg-white p-6 rounded-3xl shadow mt-8">
        <h2 className="text-xl font-semibold mb-4">
          Jadwal Saya
        </h2>

        {scheduleList.length === 0 ? (
          <p className="text-gray-400">Belum ada jadwal</p>
        ) : (
          <div className="space-y-3">
            {scheduleList.map((item, i) => (
              <div key={i} className="border p-4 rounded-xl">
                <p className="font-bold">{item.title}</p>
                <p className="text-sm text-gray-500">
                  {item.day} - {item.time}
                </p>
                {item.email && (
                  <p className="text-sm text-gray-400">
                    📧 {item.email}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}