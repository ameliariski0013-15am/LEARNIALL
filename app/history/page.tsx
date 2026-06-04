"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function HistoryPage() {
  const router = useRouter()
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from("study_history")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.log(error)
      } else {
        setHistory(data || [])
      }

      setLoading(false)
    }

    fetchHistory()
  }, [])

  return (
    <div className="min-h-screen bg-pink-50 relative p-10">

      {/* BACK BUTTON - Pojok Kiri Atas */}
      <button
        onClick={() => router.push("/dashboard")}
        className="fixed top-6 right-6 text-4xl hover:scale-125 transition-transform duration-200 cursor-pointer z-40"
        title="Kembali"
      >
        ←
      </button>

      <h1 className="text-4xl font-bold mb-8 pt-2">
        📜 History Belajar
      </h1>

      {loading ? (
        <p>Loading...</p>

      ) : history.length === 0 ? (
        <p className="text-gray-500">Belum ada history</p>

      ) : (
        <div className="grid gap-6">
          {history.map((item, index) => (
            <div
              key={item?.id ?? index}
              className="bg-white p-6 rounded-2xl shadow"
            >
              <div className="flex justify-between mb-2">
                <h2 className="font-bold text-pink-500">
                  {item?.user_name ?? "Unknown User"}
                </h2>

                <span className="text-sm text-gray-400">
                  {item?.created_at
                    ? new Date(item.created_at).toLocaleString()
                    : "-"}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-2">
                📄 Input:
              </p>

              <p className="text-gray-700 mb-4 line-clamp-3">
                {item?.input_text ?? "-"}
              </p>

              <p className="text-gray-600 text-sm mb-2">
                🤖 Hasil AI:
              </p>

              <pre className="whitespace-pre-wrap text-gray-700">
                {item?.result ?? "-"}
              </pre>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}