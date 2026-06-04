"use client";

import { useState } from "react";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Halo 👋 Ada yang bisa saya bantu?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await response.json();
      const aiText = data.text ?? "Maaf, tidak ada respons.";
      setMessages((prev) => [...prev, { role: "ai", text: aiText }]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: "Terjadi kesalahan. Coba lagi ya!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-pink-500 text-white text-3xl shadow-lg hover:bg-pink-600 transition z-50"
      >
        ?
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-3xl shadow-2xl flex flex-col z-50">

          <div className="bg-yellow-100 p-4 rounded-t-3xl">
            <h2 className="font-bold text-lg">🤖 Learnial AI</h2>
            <p className="text-sm text-gray-600">Siap membantu belajar</p>
          </div>

          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl max-w-[80%] text-sm ${
                  msg.role === "ai"
                    ? "bg-pink-100 self-start"
                    : "bg-pink-500 text-white self-end"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="bg-pink-100 p-3 rounded-xl self-start text-sm text-gray-400">
                Sedang mengetik...
              </div>
            )}
          </div>

          <div className="p-4 border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ketik pertanyaan..."
              className="flex-1 border rounded-xl p-2 text-sm"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-pink-500 text-white px-4 rounded-xl disabled:opacity-50"
            >
              Kirim
            </button>
          </div>

        </div>
      )}
    </>
  );
}