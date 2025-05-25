import inquirer from "inquirer";
import Table from "cli-table3";
import chalk from "chalk";
import { TaskPriority, TaskStatus, Todo } from "../models/Todo";

export async function showMainMenu(): Promise<
  "create" | "view" | "update" | "delete" | "exit"
> {
  const answer = await inquirer.prompt<{
    action: "create" | "view" | "update" | "delete" | "exit";
  }>([
    {
      type: "rawlist",
      name: "action",
      message: "Select Option!",
      choices: [
        { name: "Create Task", value: "create" },
        { name: "View Task", value: "view" },
        { name: "Update Task", value: "update" },
        { name: "Delete Task", value: "delete" },
        { name: "Exit", value: "exit" },
      ],
    },
  ]);

  return answer.action;
}

export async function promptCreateTask(): Promise<{
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
}> {
  const answer = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "Enter Title:",
      validate: (input) => (input ? true : "Title is required."),
    },

    {
      type: "input",
      name: "description",
      message: "Enter descriptiop:",
    },

    {
      type: "list",
      name: "status",
      message: "Select Status:",
      choices: ["Todo", "Pending", "Done"],
    },

    {
      type: "list",
      name: "priority",
      message: "Select Priority:",
      choices: ["Low", "Medium", "High"],
    },
  ]);

  return answer;
}

export function displayTasksTable(tasks: Todo[]): void {
  if (tasks.length === 0) {
    console.log("No tasks found.");
    return;
  }

  const table = new Table({
    head: [
      "",
      "No",
      "Title",
      "Description",
      "Status",
      "Priority",
      "Created At",
    ],
    colWidths: [3, 5, 20, 30, 10, 10, 15],
    wordWrap: true,
  });

  tasks.forEach((task) => {
    const date = new Date(task.CreatedAt);
    const dateOnly = date.toLocaleDateString();

    const isDone = task.Status === "Done";
    const doneMark = isDone ? chalk.greenBright("✔") : "";

    const status =
      task.Status === "Done"
        ? chalk.green(task.Status)
        : task.Status === "Pending"
        ? chalk.blue(task.Status)
        : task.Status === "Todo"
        ? chalk.gray(task.Status)
        : task.Status;

    const priority =
      task.Priority === "High"
        ? chalk.redBright(task.Priority)
        : task.Priority === "Medium"
        ? chalk.yellow(task.Priority)
        : task.Priority === "Low"
        ? chalk.greenBright(task.Priority)
        : task.Priority;

    table.push([
      doneMark,
      task.No,
      task.Title,
      task.Description,
      status,
      priority,
      dateOnly,
    ]);
  });

  console.log(table.toString());
}

export async function promptDeleteTask(tasks: Todo[]): Promise<number> {
  const awnser = await inquirer.prompt<{
    selectedNo: number;
  }>([
    {
      type: "list",
      name: "selectedNo",
      message: "Select the task to delete:",
      choices: tasks.map((task) => ({
        name: `${task.No} - ${task.Title}`,
        value: task.No,
      })),
    },
  ]);

  return awnser.selectedNo;
}

export async function promptUpdateStatus(tasks: Todo[]): Promise<{
  no: number;
  status: TaskStatus;
}> {
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "no",
      message: "Select task to update status:",
      choices: tasks.map((task) => ({
        name: `${task.No} - ${task.Title}`,
        value: task.No,
      })),
    },
    {
      type: "list",
      name: "status",
      message: "Select new status:",
      choices: ["Todo", "Pending", "Done"],
    },
  ]);
  return { no: answer.no, status: answer.status };
}
