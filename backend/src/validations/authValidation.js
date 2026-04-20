import { z } from 'zod';

export const registerSchema = z.object({
    username: z
        .string({ requred_error: 'Username is required' })
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be at most 30 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores'),
    email: z
        .string({ required_error: 'Email is required' })
        .email('Invalid email format'),
    password: z
        .string({ required_error: 'Password is required' })
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password is too long'),
    role: z
        .enum(['user', 'admin'])
        .optional()
        .default('user'),
})

export const loginSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .email('Invalid email format'),
    password: z
        .string({ required_error: 'Password is required' })
        .min(1, 'Password is required'),
});