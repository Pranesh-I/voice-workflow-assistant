export async function detectContinue(userCommand) {
  if (!userCommand || userCommand.trim().length === 0) {
    return { continue: true };
  }

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  if (!API_KEY) {
    // Fast local fallback for sleep words
    const lower = userCommand.toLowerCase();
    const sleepWords = ["stop listening", "exit", "sleep", "go offline", "goodbye", "bye"];
    const shouldStop = sleepWords.some(word => lower.includes(word));
    return { continue: !shouldStop };
  }

  const prompt = `You are managing continuous listening mode for a voice assistant.
Your job is to decide whether the assistant should keep listening or stop.

IMPORTANT:
- Return ONLY JSON
- No explanation

========================
RULES
========================
- If user says "stop listening", "exit", "sleep", "go offline" -> stop
- Otherwise -> continue listening

========================
OUTPUT
========================
{
  "continue": true/false
}

========================
EXAMPLES
========================
User: stop listening
{ "continue": false }

User: exit
{ "continue": false }

User: open chrome
{ "continue": true }

User: next command
{ "continue": true }

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
    let aiText = result.candidates?.[0]?.content?.parts?.[0]?.text || '{"continue": true}';
    aiText = aiText.replace(/```json/gi, "").replace(/```/g, "").trim();
    
    return JSON.parse(aiText);
  } catch (error) {
    console.error("Failed to detect continuous mode:", error);
    return { continue: true };
  }
}
