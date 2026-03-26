export async function detectIntentWithGemini(text) {

  const command = text.toLowerCase().trim();

  // ---------- LOCAL RULE ENGINE (NO GEMINI CALL) ----------
  if (command.includes("youtube")) {
    return {
      task: "open_youtube",
      date: "",
      time: "",
      priority: "normal"
    };
  }

  if (command.includes("calculator")) {
    return {
      task: "open_calculator",
      date: "",
      time: "",
      priority: "normal"
    };
  }

  if (command.includes("whatsapp")) {
    return {
      task: "open_whatsapp",
      date: "",
      time: "",
      priority: "normal"
    };
  }

  if (command.includes("reminder") || command.includes("remind")) {
    return {
      task: "set_reminder",
      date: "",
      time: "",
      priority: "normal"
    };
  }

  // ---------- GEMINI FALLBACK ONLY WHEN NEEDED ----------

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `
Extract task details and return STRICT JSON.

Rules:
- Always return all fields
- If date missing return ""
- If time missing return ""
- If priority missing return "normal"

Return format:

{
  "task": "",
  "date": "",
  "time": "",
  "priority": ""
}

Sentence: "${text}"
`
              }
            ]
          }
        ]
      })
    }
  );

  const data = await response.json();

  console.log("FULL GEMINI RESPONSE:", data);

  if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error("Invalid Gemini response");
  }

  let aiText = data.candidates[0].content.parts[0].text;

  aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();

  const parsed = JSON.parse(aiText);

  parsed.priority = parsed.priority || "normal";

  return parsed;
}