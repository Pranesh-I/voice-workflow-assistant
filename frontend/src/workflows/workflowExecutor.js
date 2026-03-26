import { open } from "@tauri-apps/plugin-shell";
import { openUrl } from "@tauri-apps/plugin-opener";
import { saveTask } from "../storage/taskStorage";
import { invoke } from "@tauri-apps/api/core";

export async function executeWorkflow(command) {

  const action = command.action?.toLowerCase();

  if (!action) {
    if (command.task) {
      // Fallback for simple task structure or local rule engine return type
      saveTask({
        task: command.task,
        date: command.date || "",
        time: command.time || "",
        priority: "normal"
      });
      alert(`Task saved: ${command.task}`);
      return;
    }
    console.log("No valid action or task detected");
    return;
  }

  if (action === "open_app") {
    let app = command.app?.toLowerCase();
    
    // For local rule engine compatibility
    if (!app && command.task) {
       app = command.task.replace("open_", "").replace("open ", "").trim();
    }

    console.log(`Opening app: ${app}...`);

    // ---------- WEB APPS (open in browser) ----------
    const webApps = {
      "youtube": "https://www.youtube.com",
      "google": "https://www.google.com",
      "whatsapp": "https://web.whatsapp.com",
      "facebook": "https://www.facebook.com",
      "instagram": "https://www.instagram.com",
      "twitter": "https://www.twitter.com",
      "x": "https://www.x.com",
      "linkedin": "https://www.linkedin.com",
      "github": "https://www.github.com",
      "gmail": "https://mail.google.com",
      "google drive": "https://drive.google.com",
      "google maps": "https://maps.google.com",
      "google calendar": "https://calendar.google.com",
      "netflix": "https://www.netflix.com",
      "amazon": "https://www.amazon.com",
      "reddit": "https://www.reddit.com",
      "spotify": "https://open.spotify.com",
      "chatgpt": "https://chat.openai.com",
      "canva": "https://www.canva.com",
      "figma": "https://www.figma.com",
      "notion": "https://www.notion.so",
      "slack": "https://slack.com",
      "discord": "https://discord.com/app",
      "telegram": "https://web.telegram.org",
      "pinterest": "https://www.pinterest.com",
      "stackoverflow": "https://stackoverflow.com",
      "stack overflow": "https://stackoverflow.com"
    };

    if (webApps[app]) {
      try {
        await openUrl(webApps[app]);
      } catch (e) {
        console.warn("openUrl failed, falling back to shell open:", e);
        await open(webApps[app]);
      }
      return;
    }

    // ---------- DESKTOP APPS (open as executable) ----------
    const desktopAliases = {
      "visual studio": "devenv",
      "visual studio code": "code",
      "vs code": "code",
      "vscode": "code",
      "word": "winword",
      "microsoft word": "winword",
      "excel": "excel",
      "powerpoint": "powerpnt",
      "paint": "mspaint",
      "command prompt": "cmd",
      "terminal": "wt",
      "notepad": "notepad",
      "calculator": "calc",
      "file explorer": "explorer",
      "explorer": "explorer",
      "task manager": "taskmgr",
      "snipping tool": "snippingtool",
      "control panel": "control",
      "recycle bin": "shell:RecycleBinFolder",
      "settings": "ms-settings:",
      "camera": "microsoft.windows.camera:",
      "clock": "ms-clock:",
      "maps": "bingmaps:",
      "store": "ms-windows-store:",
      "microsoft store": "ms-windows-store:"
    };

    const executableName = desktopAliases[app] || app;

    try {
      await invoke("open_app", { appName: executableName });
    } catch (e) {
      console.warn(`Failed to open dynamic app ${executableName} (original ${app}):`, e);
      alert(`Could not find or open "${app}". Ensure it is installed and added to your system PATH.`);
    }
    return;
  }

  const buildCalendarUrl = (title, dateStr, timeStr) => {
    let url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title || "Meeting")}`;
    if (dateStr && timeStr && dateStr.includes("-") && timeStr.includes(":")) {
      const cleanDate = dateStr.replace(/-/g, ""); 
      const cleanTime = timeStr.replace(/:/g, "") + "00"; 
      
      let parts = timeStr.split(":");
      let endH = parseInt(parts[0], 10) + 1;
      if (endH > 23) endH = 23; 
      let endHourStr = endH < 10 ? "0" + endH : endH;
      const cleanEndTime = `${endHourStr}${parts[1]}00`;
      
      url += `&dates=${cleanDate}T${cleanTime}/${cleanDate}T${cleanEndTime}`;
    }
    return url;
  };

  if (action === "schedule_meeting") {
    const calUrl = buildCalendarUrl(command.meeting?.title, command.date, command.meeting?.time || command.time);
    console.log("Opening Google Calendar:", calUrl);
    try {
      await openUrl(calUrl);
    } catch (e) {
      await open(calUrl);
    }
    return;
  }

  if (action === "create_task") {
    saveTask({
      task: command.task,
      date: command.date || "",
      time: command.time || "",
      priority: "normal"
    });
    
    // Smoothly go to Google Calendar with the task in the title (no alert pop-ups)
    const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(command.task || "New Task")}`;
    console.log("Opening Google Calendar for task:", calUrl);
    try {
      await openUrl(calUrl);
    } catch (e) {
      await open(calUrl);
    }
    return;
  }

  if (action === "send_email") {
    console.log("Preparing email...");
    const mailtoLink = `mailto:${command.to || ""}?subject=${encodeURIComponent(command.subject || "")}&body=${encodeURIComponent(command.message || "")}`;
    try {
      await openUrl(mailtoLink);
    } catch (e) {
      console.warn("openUrl failed, falling back to shell open:", e);
      await open(mailtoLink);
    }
    return;
  }

  if (action === "email_and_schedule") {
    console.log("Preparing email and scheduling meeting...");
    const mailtoLink = `mailto:${command.to || ""}?subject=${encodeURIComponent(command.subject || "")}&body=${encodeURIComponent(command.message || "")}`;
    try {
      await openUrl(mailtoLink);
    } catch (e) {
      await open(mailtoLink);
    }
    
    // Also smoothly open calendar
    setTimeout(async () => {
      const calUrl = buildCalendarUrl(command.meeting?.title, command.date, command.meeting?.time || command.time);
      try {
        await openUrl(calUrl);
      } catch (e) {
        await open(calUrl);
      }
    }, 500);
    return;
  }

  console.log("No workflow matched for action:", action);
}