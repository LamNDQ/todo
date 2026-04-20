import express from 'express';
import { getAllTasks, createTask, updateTask, deleteTask } from '../controllers/tasksControllers.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { createTaskSchema, updateTaskSchema } from '../validations/taskValidation.js';

const router = express.Router();

// All task routes require authentication
router.use(authenticate);

router.get('/', getAllTasks);
router.post('/', validate(createTaskSchema), createTask);
router.put('/:id', validate(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

export default router;
