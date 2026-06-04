"use client";

import { useState } from "react";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Tombol Floating */}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-pink-500 text-white text-3xl shadow-lg hover:bg-pink-600 transition z-50"
      >
        ?
      </button>

      {/* Chat Box */}

      {open && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-3xl shadow-2xl flex flex-col z-50">

          <div className="bg-yellow-100 p-4 rounded-t-3xl">

            <h2 className="font-bold text-lg">
              🤖 Learnial AI
            </h2>

            <p className="text-sm text-gray-600">
              Siap membantu belajar
            </p>

          </div>

          <div className="flex-1 p-4 overflow-y-auto">

            <div className="bg-pink-100 p-3 rounded-xl inline-block">
              Halo 👋 Ada yang bisa saya bantu?
            </div>

          </div>

          <div className="p-4 border-t flex gap-2">

            <input
              type="text"
              placeholder="Ketik pertanyaan..."
              className="flex-1 border rounded-xl p-2"
            />

            <button className="bg-pink-500 text-white px-4 rounded-xl">
              Kirim
            </button>

          </div>

        </div>
      )}
    </>
  );
}