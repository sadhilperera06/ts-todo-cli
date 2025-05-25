//This will load from JSON, this will save to JSON.
import * as fs from 'fs';
import { Todo } from '../models/Todo';

const TASKS_FILE_PATH = './data/tasks.json';

export async function writeTasks(tasks:Todo[]): Promise<void> {
    const json = JSON.stringify(tasks, null, 2);

    await fs.promises.writeFile(TASKS_FILE_PATH, json, 'utf-8');

}

export async function readTasks(): Promise<Todo[]> {
    try {
        const data = await fs.promises.readFile(TASKS_FILE_PATH, 'utf-8');
        const tasks: Todo[] = JSON.parse(data);
        return tasks;
    } catch (err:any) {
        if (err.code === 'ENOENT') {
            return [];
        }else {
            throw err;
        }
    }
}
