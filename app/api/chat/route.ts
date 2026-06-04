import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "Kamu adalah Learnial AI, asisten belajar yang ramah. Jawab dalam Bahasa Indonesia." },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    console.log("GROQ RESPONSE:", JSON.stringify(data));
    const text = data.choices?.[0]?.message?.content ?? "Maaf, tidak ada respons.";
    return NextResponse.json({ text });

  } catch (error) {
    console.error("ERROR:", error);
    return NextResponse.json({ text: "Error: " + error });
  }
}