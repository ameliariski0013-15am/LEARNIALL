import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import mammoth from "mammoth"
import Groq from "groq-sdk"

export const runtime = "nodejs"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const groqApiKey = process.env.GROQ_API_KEY

if (!groqApiKey) {
  throw new Error("GROQ_API_KEY tidak ditemukan di .env.local")
}

const groq = new Groq({ apiKey: groqApiKey })

async function callGroq(prompt, maxTokens = 1000) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.5,
    max_tokens: maxTokens,
    messages: [{ role: "user", content: prompt }],
  })
  return completion?.choices?.[0]?.message?.content || ""
}

async function extractText(file) {
  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = file.name?.toLowerCase() || ""

    if (filename.endsWith(".pdf")) {
      const pdfParse = (await import("pdf-parse")).default
      const data = await pdfParse(buffer)
      return data.text || ""
    }

    if (filename.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer })
      return result.value || ""
    }

    if (filename.endsWith(".pptx")) {
      const JSZip = (await import("jszip")).default
      const zip = await JSZip.loadAsync(buffer)
      const slideFiles = Object.keys(zip.files).filter(
        (f) => f.startsWith("ppt/slides/slide") && f.endsWith(".xml")
      )

      let allText = ""
      for (const slideFile of slideFiles) {
        const xml = await zip.files[slideFile].async("string")
        const matches = xml.match(/<a:t[^>]*>([^<]+)<\/a:t>/g) || []
        const slideText = matches
          .map((m) => m.replace(/<[^>]+>/g, ""))
          .join(" ")
        allText += slideText + "\n"
      }

      return allText.trim()
    }

    return ""
  } catch (err) {
    console.error("❌ FILE PARSE ERROR:", err.message)
    throw new Error(`Gagal membaca file: ${err.message}`)
  }
}

async function generateSummary(text) {
  try {
    return await callGroq(
      `Buatkan ringkasan singkat dan jelas dari teks berikut dalam bahasa Indonesia.

Ringkasan harus:
- Maksimal 300 kata
- Mencakup ide utama
- Gunakan bahasa sederhana

TEKS:
${text}`,
      1024
    )
  } catch (err) {
    console.error("❌ GROQ SUMMARY ERROR:", err.message)
    throw new Error(`AI Summary gagal: ${err.message}`)
  }
}

async function generateKeyPoints(text) {
  try {
    const response = await callGroq(
      `Ekstrak poin-poin penting dan kata kunci dari teks berikut.

Balas hanya JSON valid:

{
  "keyPoints": ["poin 1"],
  "keywords": ["kata kunci 1"]
}

TEKS:
${text}`,
      800
    )
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { keyPoints: [], keywords: [] }
  } catch (err) {
    console.error("❌ GROQ KEY POINTS ERROR:", err.message)
    return { keyPoints: [], keywords: [] }
  }
}

async function generateMindmap(text) {
  try {
    return await callGroq(
      `Buatkan mindmap struktur topik dari teks berikut dalam format text/ASCII.

Format:
📌 TOPIK UTAMA
├── Sub-topik
│   ├── Detail
│   └── Detail
└── Sub-topik

TEKS:
${text.slice(0, 2000)}`,
      600
    )
  } catch (err) {
    console.error("❌ GROQ MINDMAP ERROR:", err.message)
    return "Mindmap tidak tersedia"
  }
}

async function generateQuiz(text) {
  try {
    const response = await callGroq(
      `Buatkan soal kuis dari materi berikut.

Balas hanya JSON valid:

{
  "multipleChoice": [
    {
      "id": 1,
      "question": "",
      "options": [],
      "correctAnswer": "",
      "explanation": ""
    }
  ],
  "essay": [
    {
      "id": 1,
      "question": "",
      "keyAnswer": "",
      "explanation": ""
    }
  ]
}

BUAT:
- 5 soal pilihan ganda
- 2 soal essay
- Sertakan jawaban dan penjelasan

MATERI:
${text.slice(0, 3000)}`,
      2000
    )
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { multipleChoice: [], essay: [] }
  } catch (err) {
    console.error("❌ GROQ QUIZ ERROR:", err.message)
    return { multipleChoice: [], essay: [] }
  }
}

function validateInput(file, text) {
  if (!file && !text) {
    throw new Error("Silakan upload file atau masukkan teks materi")
  }
  if (file && file.size > 10 * 1024 * 1024) {
    throw new Error("File terlalu besar (maksimal 10MB)")
  }
}

export async function POST(req) {
  const startTime = Date.now()

  try {
    console.log("🔥 [STUDY API] REQUEST STARTED")

    const formData = await req.formData()
    const file = formData.get("file")
    const text = formData.get("text")
    const userName = formData.get("user_name") || "Mahasiswa"

    validateInput(file, text)

    let finalText = ""

    if (file && typeof file === "object" && file.name) {
      console.log(`📄 [EXTRACT] File: ${file.name}`)
      finalText = await extractText(file)
    }

    if (!finalText && text) {
      finalText = String(text).trim()
    }

    finalText = finalText.trim()

    if (finalText.length < 100) {
      return NextResponse.json(
        {
          success: false,
          error: "Teks materi terlalu pendek (minimal 100 karakter). Pastikan file tidak kosong atau terlindungi password.",
        },
        { status: 400 }
      )
    }

    console.log(`📊 [TEXT] Length: ${finalText.length} karakter`)
    console.log("🤖 [AI] Starting processing...")

    const [summary, keyPoints, mindmap, quiz] = await Promise.all([
      generateSummary(finalText),
      generateKeyPoints(finalText),
      generateMindmap(finalText),
      generateQuiz(finalText),
    ])

    console.log("✅ [AI] Processing complete")

    try {
      await supabase.from("study_history").insert([
        {
          user_name: String(userName),
          input_text: finalText.slice(0, 5000),
          summary: summary.slice(0, 1000),
          key_points: JSON.stringify(keyPoints),
          mindmap: mindmap.slice(0, 1000),
          quiz_data: JSON.stringify(quiz),
          created_at: new Date().toISOString(),
        },
      ])
      console.log("💾 [DB] Data saved to Supabase")
    } catch (dbErr) {
      console.warn("⚠️ [DB] Supabase error (non-blocking):", dbErr.message)
    }

    const processingTime = ((Date.now() - startTime) / 1000).toFixed(2)

    return NextResponse.json(
      {
        success: true,
        data: {
          summary,
          keyPoints: keyPoints.keyPoints || [],
          keywords: keyPoints.keywords || [],
          mindmap,
          quiz: {
            multipleChoice: quiz.multipleChoice || [],
            essay: quiz.essay || [],
          },
        },
        metadata: {
          textLength: finalText.length,
          processingTime: `${processingTime}s`,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error(`❌ [ERROR] ${error.message}`)

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Terjadi kesalahan pada server",
      },
      { status: error.status || 500 }
    )
  }
}