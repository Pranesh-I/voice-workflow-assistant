export async function detectIntentWithGemini(text) {
  if (!text || text.trim().length === 0) {
    return null;
  }

  const command = text.toLowerCase().trim();

  // ---------- YOUTUBE RULES ----------
  const playYtMatch = command.match(/(?:play|search(?: for)?)\s+(.+?)\s*(?:on )?youtube/i) 
                   || command.match(/(?:play|search(?: for)?)\s+(?:a\s+)?(?:youtube|yt)(?:\s+video)?(?:\s+of|\s+about)?\s+(.+)/i)
                   || command.match(/youtube(?: play| search(?: for)?)\s+(.+)/i);
  
  if (playYtMatch) {
    let query = (playYtMatch[1] || playYtMatch[2] || playYtMatch[3] || "").trim();
    
    // Clean up trailing and leading filler words
    query = query.replace(/^youtube\s+/i, "").replace(/\s+on\s+youtube$/i, "");
    if (query.endsWith(" on")) query = query.slice(0, -3).trim();
    if (query === "a" || query === "the" || query === "a video" || query === "video") {
       query = ""; // Discard if the query is just a filler word
    }

    if (query) {
      return {
        action: "youtube_search",
        task: query
      };
    }
  }

  if (command.includes("youtube")) {
    // Default fallback if no specific search query is found
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

  // ---------- SYSTEM CONTROL RULES ----------
  
  // Volume Control
  if (command.includes("volume up") || command.includes("increase volume") || command.includes("louder")) {
    return { action: "set_volume", level: "increase" };
  }
  if (command.includes("volume down") || command.includes("decrease volume") || command.includes("quieter")) {
    return { action: "set_volume", level: "decrease" };
  }
  if (command.match(/volume.*(\d+)/i)) {
    const match = command.match(/volume.*(\d+)/i);
    return { action: "set_volume", level: match[1] };
  }

  // Brightness Control
  if (command.includes("brightness up") || command.includes("increase brightness") || command.includes("brighter")) {
    return { action: "set_brightness", level: "increase" };
  }
  if (command.includes("brightness down") || command.includes("decrease brightness") || command.includes("darker")) {
    return { action: "set_brightness", level: "decrease" };
  }
  if (command.match(/brightness.*(\d+)/i)) {
    const match = command.match(/brightness.*(\d+)/i);
    return { action: "set_brightness", level: match[1] };
  }

  // WiFi Control
  if (command.includes("wifi on") || command.includes("enable wifi") || command.includes("turn on wifi")) {
    return { action: "toggle_wifi", state: "on" };
  }
  if (command.includes("wifi off") || command.includes("disable wifi") || command.includes("turn off wifi")) {
    return { action: "toggle_wifi", state: "off" };
  }
  if (command.includes("toggle wifi") || command.includes("wifi")) {
    return { action: "toggle_wifi" };
  }

  // Bluetooth Control
  if (command.includes("bluetooth on") || command.includes("enable bluetooth") || command.includes("turn on bluetooth")) {
    return { action: "toggle_bluetooth", state: "on" };
  }
  if (command.includes("bluetooth off") || command.includes("disable bluetooth") || command.includes("turn off bluetooth")) {
    return { action: "toggle_bluetooth", state: "off" };
  }
  if (command.includes("toggle bluetooth") || command.includes("bluetooth")) {
    return { action: "toggle_bluetooth" };
  }

  // Airplane Mode
  if (command.includes("airplane mode on") || command.includes("enable airplane mode")) {
    return { action: "toggle_airplane_mode", state: "on" };
  }
  if (command.includes("airplane mode off") || command.includes("disable airplane mode")) {
    return { action: "toggle_airplane_mode", state: "off" };
  }
  if (command.includes("airplane mode") || command.includes("flight mode")) {
    return { action: "toggle_airplane_mode" };
  }

  // Night Light
  if (command.includes("night light on") || command.includes("enable night light")) {
    return { action: "toggle_night_light", state: "on" };
  }
  if (command.includes("night light off") || command.includes("disable night light")) {
    return { action: "toggle_night_light", state: "off" };
  }
  if (command.includes("night light")) {
    return { action: "toggle_night_light" };
  }

  // Energy Saver
  if (command.includes("energy saver on") || command.includes("battery saver on") || command.includes("enable energy saver")) {
    return { action: "toggle_energy_saver", state: "on" };
  }
  if (command.includes("energy saver off") || command.includes("battery saver off") || command.includes("disable energy saver")) {
    return { action: "toggle_energy_saver", state: "off" };
  }
  if (command.includes("energy saver") || command.includes("battery saver")) {
    return { action: "toggle_energy_saver" };
  }

  // ---------- CLOSE / EXIT / QUIT APP RULES ----------
  // Extract the app name from phrases like "close chrome", "exit notepad", "quit the calculator"
  const closeMatch = command.match(/\b(?:close|exit|quit|kill|terminate)\b\s+(?:the\s+)?(.+)/i);
  if (closeMatch) {
    const targetApp = closeMatch[1].trim();
    // "close the app" / "close the application" / "exit the app" means close the currently active app
    if (["app", "application", "program", "window", "this", "it"].includes(targetApp)) {
      return { action: "close_app", app: "current" };
    }
    return { action: "close_app", app: targetApp };
  }
  // Standalone "close" / "exit" / "quit" without a target
  if (/^(close|exit|quit)$/.test(command)) {
    return { action: "close_app", app: "current" };
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
                text: `You are an advanced AI command parser for a voice assistant called "Sonix".

Your job is to convert natural language commands into STRICT JSON.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 CORE RULE: INTENT PRIORITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You MUST follow this STRICT priority order:
1. send_email
2. schedule_meeting
3. email_and_schedule
4. youtube_search
5. open_app
6. create_task
7. system_controls
8. close_app (LOWEST PRIORITY)

⚠️ IMPORTANT:
- If a sentence contains "send", "email", or "mail" -> it is ALWAYS an email task
- NEVER interpret "send email" as "end email"
- NEVER match partial words (example: "send" is NOT "end")

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 TASK & CRITICAL SAFETY RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Return ONLY JSON (no explanation, no extra text)
- Always include all fields
- DO NOT guess intent
- DO NOT match partial words
- If value not present, return ""
- Detect user intent correctly
- Support MULTIPLE actions
- ALWAYS return date in YYYY-MM-DD format. If date is missing or "today", use "${todayStr}".
- ALWAYS return time in 24-hour HH:mm format (e.g., "18:00").
- For YouTube queries, extract ONLY the meaningful search query and remove filler words (e.g. "video", "of", "about", "on youtube").
- Also generate a short, natural voice reply (max 8-10 words, confident, no emojis).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 SUPPORTED ACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. send_email
2. schedule_meeting
3. email_and_schedule
4. open_app
5. create_task
6. set_volume
7. set_brightness
8. toggle_wifi
9. toggle_bluetooth
10. toggle_airplane_mode
11. toggle_night_light
12. toggle_energy_saver
13. close_app
14. youtube_search

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 INTENT RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- IF user wants to play/search a YouTube video -> action = "youtube_search", query = cleaned video name, reply = "Playing {query} on YouTube"
- IF user ONLY says "open youtube" -> action = "open_app", app = "youtube", reply = "Opening YouTube"
- 📧 EMAIL DETECTION (VERY HIGH PRIORITY):
  If user uses ANY of: "send email", "send mail", "email", "mail", "deliver email", "deliver an email", "deliver mail", "send a message", "message"
  -> action = "send_email".
  Extract recipient after "to". Extract message after "saying", "that says", or "message". Keep subject empty if not provided.
  Reply: "Sending email to {Recipient}" or "Sending your message".
  ❌ IMPORTANT: NEVER treat email commands (like "deliver email", "send email") as close_app.
- If user says "schedule meeting" -> schedule_meeting
- If BOTH email + meeting -> email_and_schedule
- If user says "open chrome / calculator" -> open_app
- If reminder/task -> create_task
- IF volume mentioned -> action = "set_volume", level = "up", "down", or integer
- IF brightness mentioned -> action = "set_brightness", level = "up", "down", or integer
- IF WiFi mentioned -> action = "toggle_wifi", state = "on" / "off"
- IF Bluetooth mentioned -> action = "toggle_bluetooth", state = "on" / "off", reply = "Opening Bluetooth settings"
- IF Airplane Mode mentioned -> action = "toggle_airplane_mode", state = "on" / "off", reply = "Opening airplane mode settings"
- IF Night Light mentioned -> action = "toggle_night_light", state = "on" / "off", reply = "Opening night light settings"
- IF Energy Saver mentioned -> action = "toggle_energy_saver", state = "on" / "off", reply = "Opening battery saver settings"
- IF user clearly says "close/exit/quit/terminate" an app -> action = "close_app", app = extracted app name. Remove filler words ("the", "app", "window"). Treat Web apps (YouTube, Gmail, etc.) same as normal app. DO NOT trigger if part of another word (e.g. "send email" is NOT "end email"). Invalid for close: "send email", "ending meeting".
- IF no specific app named (e.g. "close app", "exit", "quit", "close this") -> action = "close_app", app = "current", reply = "Closing current app"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 RETURN FORMAT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  "action": "",
  "query": "",
  "reply": "",
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
  "app": "",
  "level": "",
  "state": ""
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ EXAMPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Input: deliver an email to prasanna saying hello
Output:
{
  "action": "send_email",
  "query": "",
  "reply": "Sending email to Prasanna",
  "to": "prasanna@example.com",
  "subject": "",
  "message": "hello",
  "meeting": { "title": "", "time": "" },
  "task": "",
  "date": "",
  "time": "",
  "app": "",
  "level": "",
  "state": ""
}

Input: mail john message meeting at 5
Output:
{
  "action": "send_email",
  "query": "",
  "reply": "Sending email to John",
  "to": "john@example.com",
  "subject": "",
  "message": "meeting at 5",
  "meeting": { "title": "", "time": "" },
  "task": "",
  "date": "",
  "time": "",
  "app": "",
  "level": "",
  "state": ""
}

Input: Play a YouTube video of Naruto fight scenes
Output:
{
  "action": "youtube_search",
  "query": "naruto fight scenes",
  "reply": "Playing Naruto fight scenes on YouTube",
  "to": "",
  "subject": "",
  "message": "",
  "meeting": { "title": "", "time": "" },
  "task": "",
  "date": "",
  "time": "",
  "app": "",
  "level": "",
  "state": ""
}

Input: Send email to john saying meeting at 5
Output:
{
  "action": "send_email",
  "query": "",
  "reply": "Emailing John about the meeting",
  "to": "john@example.com",
  "subject": "Meeting",
  "message": "meeting at 5",
  "meeting": { "title": "", "time": "" },
  "task": "",
  "date": "",
  "time": "",
  "app": "",
  "level": "",
  "state": ""
}

Input: please close the youtube
Output:
{
  "action": "close_app",
  "query": "",
  "reply": "Closing YouTube",
  "to": "",
  "subject": "",
  "message": "",
  "meeting": { "title": "", "time": "" },
  "task": "",
  "date": "",
  "time": "",
  "app": "youtube",
  "level": "",
  "state": ""
}

Input: close app
Output:
{
  "action": "close_app",
  "query": "",
  "reply": "Closing current app",
  "to": "",
  "subject": "",
  "message": "",
  "meeting": { "title": "", "time": "" },
  "task": "",
  "date": "",
  "time": "",
  "app": "current",
  "level": "",
  "state": ""
}

Input: set volume to 80
Output:
{
  "action": "set_volume",
  "query": "",
  "reply": "Setting volume to 80",
  "to": "",
  "subject": "",
  "message": "",
  "meeting": { "title": "", "time": "" },
  "task": "",
  "date": "",
  "time": "",
  "app": "",
  "level": 80,
  "state": ""
}

Input: turn off wifi
Output:
{
  "action": "toggle_wifi",
  "query": "",
  "reply": "Turning WiFi off",
  "to": "",
  "subject": "",
  "message": "",
  "meeting": { "title": "", "time": "" },
  "task": "",
  "date": "",
  "time": "",
  "app": "",
  "level": "",
  "state": "off"
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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
      query: "",
      reply: "",
      to: "",
      subject: "",
      message: "",
      meeting: { title: "", time: "" },
      task: "",
      date: "",
      time: "",
      app: "",
      level: "",
      state: ""
    };
  }

  console.log("Parsed Intent JSON:", parsed);

  return parsed;
}