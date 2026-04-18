import { Router } from 'express';
import { TaskController } from './TaskController';
import { TaskService } from '../service/TaskService';
import { MongoTaskRepository } from '../repository/MongoTaskRepository';

const router = Router();
const repository = new MongoTaskRepository();
const service = new TaskService(repository);
const controller = new TaskController(service);

router.get('/', (req, res) => controller.getAll(req, res));
router.get('/:id', (req, res) => controller.getById(req, res));
router.post('/', (req, res) => controller.create(req, res));
router.put('/:id', (req, res) => controller.update(req, res));
router.delete('/:id', (req, res) => controller.delete(req, res));
router.patch('/:id/complete', (req, res) => controller.complete(req, res));

export default router;