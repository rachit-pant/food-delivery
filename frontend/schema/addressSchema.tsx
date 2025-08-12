import { z } from 'zod';

export const addressSchema = z.object({
  address: z.string().min(10, 'Enter clear address'),
  country: z.string,
  state: z.string,
  city: z.string,
});
