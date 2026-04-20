import mongoose, { Schema, Document } from 'mongoose';
import { Task } from '../domain/Task';
import { ITaskRepository } from './TaskRepository';

interface TaskDocument extends Task, Document { }

const TaskSchema = new Schema<TaskDocument>({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  completed: { type: Boolean, default: false },
  subtasks: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

const TaskModel = mongoose.model<TaskDocument>('Task', TaskSchema);

export class MongoTaskRepository implements ITaskRepository {
  async findAll(): Promise<Task[]> {
    return TaskModel.find();
  }

  async findById(id: string): Promise<Task | null> {
    return TaskModel.findById(id);
  }

  async create(task: Task): Promise<Task> {
    return TaskModel.create(task);
  }

  async update(id: string, task: Partial<Task>): Promise<Task | null> {
    return TaskModel.findByIdAndUpdate(
      id,
      task,
      { returnDocument: 'after' }
    );
  }

  async delete(id: string): Promise<boolean> {
    const result = await TaskModel.findByIdAndDelete(id);
    return result !== null;
  }
}