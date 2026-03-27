export async function detectIntentWithGemini(text) {
  if (!text || text.trim().length === 0) {
    return null;
  }

  const command = text.toLowerCase().trim();

  // ---------- LOCAL RULE ENGINE (NO GEMINI CALL) ----------
  if (command.includes("youtube")) {
    return {
      action: "open_app",
      app: "youtube"
    };
  }

  if (command.includes("calculator")) {
    return {
      action: "open_app",
      app: "calc"
    };
  }

  if (command.includes("whatsapp")) {
    return {
      action: "open_app",
      app: "whatsapp"
    };
  }

  if (command.includes("reminder") || command.includes("remind")) {
    return {
      action: "create_task",
      task: "reminder",
      date: "",
      time: ""
    };
  }

  // ---------- GEMINI FALLBACK ONLY WHEN NEEDED ----------

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const todayStr = new Date().toISOString().split('T')[0];

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
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
                text: `You are an AI command parser for a voice assistant.

Convert the given sentence into STRICT JSON.

RULES:
- Return ONLY JSON (no explanation)
- Always include all fields
- If value not present, return ""
- Detect user intent correctly
- Support MULTIPLE actions
- ALWAYS return date in YYYY-MM-DD format. If date is missing or "today", use "${todayStr}".
- ALWAYS return time in 24-hour HH:mm format (e.g., "18:00").

-------------------------------------

SUPPORTED ACTIONS:

1. send_email
2. schedule_meeting
3. email_and_schedule
4. open_app
5. create_task

-------------------------------------

RETURN FORMAT:

{
  "action": "",
  "to": "",
  "subject": "",
  "message": "",
  "meeting": {
    "title": "",
    "time": ""
  },
  "task": "",
  "date": "",
  "time": "",
  "app": ""
}

-------------------------------------

INTENT RULES:

- If user says "send mail/email" -> send_email
- If user says "schedule meeting" -> schedule_meeting
- If BOTH email + meeting -> email_and_schedule
- If user says "open chrome / calculator" -> open_app
- If reminder/task -> create_task

-------------------------------------

EXAMPLES:

Input: Send email to john saying meeting at 5
Output:
{
  "action": "send_email",
  "to": "john@example.com",
  "subject": "Meeting",
  "message": "meeting at 5",
  "meeting": { "title": "", "time": "" },
  "task": "",
  "date": "",
  "time": "",
  "app": ""
}

Input: Schedule a meeting at 6 PM
Output:
{
  "action": "schedule_meeting",
  "to": "",
  "subject": "",
  "message": "",
  "meeting": {
    "title": "Meeting",
    "time": "18:00"
  },
  "task": "",
  "date": "",
  "time": "",
  "app": ""
}

Input: Email boss and schedule meeting at 7 PM
Output:
{
  "action": "email_and_schedule",
  "to": "boss@example.com",
  "subject": "Meeting",
  "message": "Meeting at 7 PM",
  "meeting": {
    "title": "Meeting",
    "time": "19:00"
  },
  "task": "",
  "date": "",
  "time": "",
  "app": ""
}

Input: Open Chrome
Output:
{
  "action": "open_app",
  "to": "",
  "subject": "",
  "message": "",
  "meeting": { "title": "", "time": "" },
  "task": "",
  "date": "",
  "time": "",
  "app": "chrome"
}

-------------------------------------

Sentence: "${text}"`
              }
            ]
          }
        ]
      })
    }
  );

  const data = await response.json();

  console.log("FULL GEMINI RESPONSE:", data);

  if (data?.error) {
    throw new Error(`Gemini API Error: ${data.error.message}`);
  }

  if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error("Invalid Gemini response: missing text");
  }

  let aiText = data.candidates[0].content.parts[0].text;

  aiText = aiText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .replace(/\n/g, " ")
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(aiText);
  } catch (err) {
    console.error("Gemini returned invalid JSON:", aiText);
    return {
      action: "",
      to: "",
      subject: "",
      message: "",
      meeting: { title: "", time: "" },
      task: "",
      date: "",
      time: "",
      app: ""
    };
  }

  console.log("Parsed Intent JSON:", parsed);

  return parsed;
}