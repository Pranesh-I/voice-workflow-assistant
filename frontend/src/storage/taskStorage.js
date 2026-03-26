export function saveTask(task) {

  const existingTasks =
    JSON.parse(localStorage.getItem("tasks")) || [];

  existingTasks.push(task);

  localStorage.setItem("tasks", JSON.stringify(existingTasks));

  console.log("Task saved:", task);
}


export function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}