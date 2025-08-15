import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.email('Email is required'),
  fullName: z.string().min(1, 'Please enter your full name'),
  password: z.string().min(5, 'Please enter a valid password'),
  phoneNumber: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
});
