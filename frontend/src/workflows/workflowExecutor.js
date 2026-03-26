import { open } from "@tauri-apps/plugin-shell";

export async function executeWorkflow(command) {

  const task = command.task?.toLowerCase();

  if (!task) {
    console.log("No task detected");
    return;
  }

  if (task.includes("youtube")) {
    await open("https://www.youtube.com");
    return;
  }

  if (task.includes("google")) {
    await open("https://www.google.com");
    return;
  }

  if (task.includes("meeting")) {
    alert(`Meeting scheduled ${command.date} ${command.time}`);
    return;
  }

  if (task.includes("reminder") || task.includes("task")) {
    alert(`Task saved: ${command.task}`);
    return;
  }

  console.log("No workflow matched");
}