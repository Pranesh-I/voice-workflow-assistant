import { open } from "@tauri-apps/plugin-shell";
import { openUrl } from "@tauri-apps/plugin-opener";
import { saveTask } from "../storage/taskStorage";

export async function executeWorkflow(command) {

  const task = command.task?.toLowerCase();

  if (!task) {
    console.log("No task detected");
    return;
  }

  if (task.includes("youtube")) {
    console.log("Opening YouTube now...");
    try {
      await openUrl("https://www.youtube.com");
    } catch (e) {
      console.warn("openUrl failed, falling back to shell open:", e);
      await open("https://www.youtube.com");
    }
    return;
  }

  if (task.includes("google")) {
    console.log("Opening Google now...");
    try {
      await openUrl("https://www.google.com");
    } catch (e) {
      console.warn("openUrl failed, falling back to shell open:", e);
      await open("https://www.google.com");
    }
    return;
  }

  if (task.includes("calculator")) {
    console.log("Opening Calculator now...");
    try {
      await open("calc");
    } catch (e) {
      console.warn("Failed to open calculator:", e);
    }
    return;
  }

  if (task.includes("whatsapp")) {
    console.log("Opening WhatsApp now...");
    try {
      await openUrl("https://web.whatsapp.com");
    } catch (e) {
      console.warn("openUrl failed, falling back to shell open:", e);
      await open("https://web.whatsapp.com");
    }
    return;
  }

  if (task.includes("meeting")) {
    alert(`Meeting scheduled ${command.date} ${command.time}`);
    return;
  }

  if (task.includes("reminder") || task.includes("task")) {
    saveTask(command);
    alert(`Task saved: ${command.task}`);
    return;
  }

  console.log("No workflow matched for task:", task);
}