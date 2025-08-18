import z from 'zod';

export const userUpdateSchema = z.object({
  fullName: z.string(),
  phoneNumber: z.string(),
  password: z.string(),
  email: z.string(),
});
