import { TaskService } from './TaskService';
import { TaskDomainError } from '../domain/Task';
import { FakeTaskRepository } from '../repository/FakeTaskRepository';

jest.mock('../../ai/GroqService', () => ({
  analyzeTask: jest.fn().mockResolvedValue({
    priority: 'high',
    subtasks: ['Step 1', 'Step 2', 'Step 3'],
    estimatedMinutes: 30,
  }),
}));

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    service = new TaskService(new FakeTaskRepository());
  });

  describe('createTask', () => {
    it('should create a task with AI generated subtasks', async () => {
      const task = await service.createTask({
        title: 'Build an API',
        description: 'REST API with auth',
      });

      expect(task.title).toBe('Build an API');
      expect(task.subtasks).toEqual(['Step 1', 'Step 2', 'Step 3']);
      expect(task.completed).toBe(false);
    })

    it('should throw if title is empty', async () => {
      await expect(service.createTask({ title: '' }))
        .rejects
        .toThrow(TaskDomainError);
    })

    it('should throw if title exceeds 100 characters', async () => {
      await expect(service.createTask({ title: 'a'.repeat(101) }))
        .rejects
        .toThrow(TaskDomainError);
    })
  })

  describe('getTaskById', () => {
    it('should return a task by id', async () => {
      const created = await service.createTask({ title: 'My task' });
      const found = await service.getTaskById(created.id!);
      expect(found.title).toBe('My task');
    })

    it('should throw if task does not exist', async () => {
      await expect(service.getTaskById('non-existent-id'))
        .rejects
        .toThrow(TaskDomainError);
    })
  })

  describe('completeTask', () => {
    it('should mark a task as completed', async () => {
      const created = await service.createTask({ title: 'My task' });
      const completed = await service.completeTask(created.id!);
      expect(completed.completed).toBe(true);
    })
  })

  describe('deleteTask', () => {
    it('should delete an existing task', async () => {
      const created = await service.createTask({ title: 'My task' });
      await service.deleteTask(created.id!);
      const tasks = await service.getAllTasks();
      expect(tasks).toHaveLength(0);
    })

    it('should throw if task does not exist', async () => {
      await expect(service.deleteTask('non-existent-id'))
        .rejects
        .toThrow(TaskDomainError);
    })
  })
})