import { read, writeFile } from "fs";
import { TaskPriority, TaskStatus, Todo } from "../models/Todo";
import { readTasks, writeTasks } from "./StorageService";
import { v4 as uuidv4 } from "uuid";

//Function signature.
export class TaskService {
  private tasks: Todo[] = [];
  private nextNo: number = 1;

  async addTask(data: {
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
  }): Promise<Todo> {
    const currentTasks = await readTasks();
    this.tasks = currentTasks;

    const maxNo =
      currentTasks.length > 0
        ? Math.max(...currentTasks.map((task) => task.No))
        : 0;
    this.nextNo = maxNo + 1;

    const newTask: Todo = {
      No: this.nextNo++,
      Id: uuidv4(),
      Title: data.title,
      Description: data.description || "",
      Status: data.status,
      Priority: data.priority,
      CreatedAt: new Date(),
    };

    this.tasks.push(newTask);
    await writeTasks(this.tasks);
    return newTask;
  }

  async getTasks(): Promise<Todo[]> {
    this.tasks = await readTasks();
    return this.tasks;
  }

  async deleteByNo(no: number): Promise<boolean> {
    const currentTasks = await readTasks();
    const existingTask = currentTasks.find((task) => task.No === no);

    if (!existingTask) {
      console.log("Task No. not found!");
      return false;
    }

    const updateTasks = currentTasks.filter((task) => task.No !== no);
    await writeTasks(updateTasks);

    this.tasks = updateTasks;

    return true;
  }

  async updateStatus(no: number, newStatus: TaskStatus): Promise<boolean> {
    const currentTasks = await readTasks();
    const task = currentTasks.find((task) => task.No === no);

    if (!task) return false;

    task.Status = newStatus;
    await writeTasks(currentTasks);
    this.tasks = currentTasks;

    return true;
  }
}
