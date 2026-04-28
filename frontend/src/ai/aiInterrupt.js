export async function detectInterruption(userCommand) {
  if (!userCommand || userCommand.trim().length === 0) {
    return { interrupt: false };
  }

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  if (!API_KEY) {
    // Fast local fallback for stop words
    const lower = userCommand.toLowerCase();
    const stopWords = ["stop", "cancel", "wait", "hold on", "shut up"];
    const isInterrupt = stopWords.some(word => lower.includes(word));
    return { interrupt: isInterrupt };
  }

  const prompt = `You are handling voice interruptions for a smart assistant.
Your job is to decide if the current speech/action should be interrupted.

IMPORTANT:
- Return ONLY JSON
- No explanation

========================
RULES
========================
Interrupt if:
- User says "stop", "cancel", "wait", "hold on"
- User gives a new command while assistant is speaking (e.g. "open chrome")

========================
OUTPUT
========================
{
  "interrupt": true/false
}

========================
EXAMPLES
========================
User: stop
{ "interrupt": true }

User: wait a second
{ "interrupt": true }

User: open chrome
{ "interrupt": true }

User: okay
{ "interrupt": false }

========================
INPUT
========================
"${userCommand}"
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 20,
          }
        }),
      }
    );

    const result = await response.json();
    let aiText = result.candidates?.[0]?.content?.parts?.[0]?.text || '{"interrupt": false}';
    aiText = aiText.replace(/```json/gi, "").replace(/```/g, "").trim();
    
    return JSON.parse(aiText);
  } catch (error) {
    console.error("Failed to detect interruption:", error);
    return { interrupt: false };
  }
}
