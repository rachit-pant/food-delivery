import { z } from 'zod';

export const addressSchema = z.object({
  address: z.string().min(10, 'Enter clear address'),
  country: z.string().min(1, 'Etner country'),
  state: z.string().min(1, 'Etner state'),
  city: z.string().min(1, 'Etner city'),
});
