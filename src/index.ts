import {
  displayTasksTable,
  promptCreateTask,
  promptDeleteTask,
  promptUpdateStatus,
  showMainMenu,
} from "./cli/Prompt";
import { TaskService } from "./services/TaskService";

async function main() {
  const service = new TaskService();

  let exit = false;

  while (!exit) {
    const action = await showMainMenu();

    if (action === "create") {
      const taskData = await promptCreateTask();
      const newTask = service.addTask(taskData);
      console.log("Task created:", newTask);
    }

    if (action === "view") {
      const tasks = await service.getTasks();
      displayTasksTable(tasks);
    }

    if (action === "update") {
      const tasks = await service.getTasks();

      if (tasks.length === 0) {
        console.log("❌ No tasks available to delete.");
        return;
      }

      const { no, status } = await promptUpdateStatus(tasks);
      const success = await service.updateStatus(no, status);

      if (success) {
        console.log(`✅ Task No ${no} updated to status: ${status}`);
      } else {
        console.log(`❌ Task No ${no} not found.`);
      }
    }

    if (action === "delete") {
      const tasks = await service.getTasks();

      if (tasks.length === 0) {
        console.log("❌ No tasks available to delete.");
        return;
      }

      const selectedNo = await promptDeleteTask(tasks);
      const success = await service.deleteByNo(selectedNo);

      if (success) {
        console.log(`✅ Task No ${selectedNo} deleted successfully!`);
      } else {
        console.log(`❌ Task No ${selectedNo} not found.`);
      }
    }

    if (action === "exit") {
      console.log("👋 Goodbye!");
      exit = true;
    }
  }
}

main();
