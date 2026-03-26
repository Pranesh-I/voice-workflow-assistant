export async function detectIntentWithGemini(text) {

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`,
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