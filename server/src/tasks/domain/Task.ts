export interface Task {
  id?: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  subtasks: string[];
  createdAt?: Date;
}

export class TaskDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TaskDomainError';
  }
}

export const validateTask = (task: Partial<Task>): void => {
  if (!task.title || task.title.trim().length === 0) {
    throw new TaskDomainError('Title is required');
  }
  if (task.title.trim().length > 100) {
    throw new TaskDomainError('Title must be 100 characters or less');
  }
};