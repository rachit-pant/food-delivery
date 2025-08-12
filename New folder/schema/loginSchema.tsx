import { z } from 'zod';
export const loginSchema = z.object({
  email: z.email('Email is required'),
  password: z.string().min(2, 'Password is required'),
});
