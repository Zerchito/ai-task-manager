import { Request, Response } from 'express';
import { TaskService } from '../service/TaskService';
import { TaskDomainError } from '../domain/Task';

export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const tasks = await this.taskService.getAllTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const task = await this.taskService.getTaskById(req.params.id as string);
      res.json(task);
    } catch (error) {
      if (error instanceof TaskDomainError) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const task = await this.taskService.createTask(req.body);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof TaskDomainError) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const task = await this.taskService.updateTask(req.params.id as string, req.body);
      res.json(task);
    } catch (error) {
      if (error instanceof TaskDomainError) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await this.taskService.deleteTask(req.params.id as string);
      res.status(204).send();
    } catch (error) {
      if (error instanceof TaskDomainError) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  async complete(req: Request, res: Response): Promise<void> {
    try {
      const task = await this.taskService.completeTask(req.params.id as string);
      res.json(task);
    } catch (error) {
      if (error instanceof TaskDomainError) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
}