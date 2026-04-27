import { Task } from '../domain/Task';
import { ITaskRepository } from './TaskRepository';

export class FakeTaskRepository implements ITaskRepository {
  private tasks: Task[] = [];
  private nextId = 1;

  async findAll(): Promise<Task[]> {
    return this.tasks;
  }

  async findById(id: string): Promise<Task | null> {
    return this.tasks.find(t => t.id === id) || null;
  }

  async create(task: Task): Promise<Task> {
    const newTask = { ...task, id: String(this.nextId++) };
    this.tasks.push(newTask);
    return newTask;
  }

  async update(id: string, data: Partial<Task>): Promise<Task | null> {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return null;
    this.tasks[index] = { ...this.tasks[index], ...data };
    return this.tasks[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    this.tasks.splice(index, 1);
    return true;
  }
}