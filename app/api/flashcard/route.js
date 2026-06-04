import { NextResponse } from "next/server"
import Groq from "groq-sdk"
import mammoth from "mammoth"

export const runtime = "nodejs"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

async function extractText(file) {
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
      const slideText = matches.map((m) => m.replace(/<[^>]+>/g, "")).join(" ")
      allText += slideText + "\n"
    }
    return allText.trim()
  }

  return ""
}

export async function POST(req) {
  try {
    const formData = await req.formData()
    const file = formData.get("file")
    const text = formData.get("text")

    let finalText = ""

    if (file && typeof file === "object" && file.name) {
      finalText = await extractText(file)
    }

    if (!finalText && text) {
      finalText = String(text).trim()
    }

    if (finalText.length < 50) {
      return NextResponse.json(
        { success: false, error: "Materi terlalu pendek (minimal 50 karakter)" },
        { status: 400 }
      )
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `Buatkan 10 flashcard dari materi berikut dalam bahasa Indonesia.

Balas HANYA JSON valid seperti ini, tanpa teks lain:

{
  "flashcards": [
    { "q": "pertanyaan", "a": "jawaban" }
  ]
}

MATERI:
${finalText.slice(0, 4000)}`,
        },
      ],
    })

    const raw = completion?.choices?.[0]?.message?.content || ""
    const jsonMatch = raw.match(/\{[\s\S]*\}/)

    if (!jsonMatch) {
      return NextResponse.json(
        { success: false, error: "AI gagal generate flashcard" },
        { status: 500 }
      )
    }

    const parsed = JSON.parse(jsonMatch[0])

    return NextResponse.json({
      success: true,
      flashcards: parsed.flashcards || [],
    })
  } catch (error) {
    console.error("❌ FLASHCARD ERROR:", error.message)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}