import { Task, TaskDomainError, validateTask } from '../domain/Task';
import { ITaskRepository } from '../repository/TaskRepository';
import { analyzeTask } from '../../ai/GroqService';

export class TaskService {
  constructor(private readonly repository: ITaskRepository) { }

  async getAllTasks(): Promise<Task[]> {
    return this.repository.findAll();
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.repository.findById(id);
    if (!task) throw new TaskDomainError('Task not found');
    return task;
  }

  async createTask(data: Partial<Task>): Promise<Task> {
    validateTask(data);

    const title = data.title!.trim();
    const description = data.description || '';

    let priority = data.priority || 'medium';
    let subtasks: string[] = [];

    try {
      const suggestion = await analyzeTask(title, description);
      priority = data.priority || suggestion.priority;
      subtasks = suggestion.subtasks;
    } catch (error) {
      console.warn('AI analysis failed, using defaults:', error);
    }

    return this.repository.create({
      title,
      description,
      priority,
      completed: false,
      subtasks,
    });
  }

  async updateTask(id: string, data: Partial<Task>): Promise<Task> {
    await this.getTaskById(id);
    const updated = await this.repository.update(id, data);
    if (!updated) throw new TaskDomainError('Task not found');
    return updated;
  }

  async deleteTask(id: string): Promise<void> {
    await this.getTaskById(id);
    await this.repository.delete(id);
  }

  async completeTask(id: string): Promise<Task> {
    return this.updateTask(id, { completed: true });
  }
}