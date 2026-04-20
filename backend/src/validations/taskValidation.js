import { z } from 'zod';

export const createTaskSchema = z.object({
    title: z
        .string({ required_error: 'Title is required' })
        .min(1, 'Title cannot be empty')
        .max(200, 'Title must be at most 200 characters')
        .trim(),
});

export const updateTaskSchema = z.object({
    title: z
        .string()
        .min(1, 'Title cannot be empty')
        .max(200, 'Title must be at most 200 characters')
        .trim()
        .optional(),
    status: z
        .enum(['active', 'completed'], {
            errorMap: () => ({ message: 'Status must be "active" or "completed"' }),
        })
        .optional(),
    completedAt: z
        .string()
        .datetime({ message: 'completedAt must be a valid ISO datetime' })
        .nullable()
        .optional(),
}).refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
})