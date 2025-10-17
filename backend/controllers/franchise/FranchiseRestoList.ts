import type { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { BetterError } from '../../middleware/errorHandler.js';
import prisma from '../../prisma/client.js';
import { z } from 'zod';

const list = expressAsyncHandler(async (req: Request, res: Response) => {
  const schema = z.object({
    franchiseId: z.coerce.number(),
  });
  const validation = schema.safeParse(req.params);
  if (!validation.success) {
    throw new BetterError(
      'Invalid franchise id',
      400,
      'INVALID_FRANCHISE_ID',
      'Franchise Error'
    );
  }
  const userId = req.user?.id;
  const franchiseId = validation.data.franchiseId;
  console.log(franchiseId, userId);
  if (!userId) {
    throw new BetterError('no user found', 400, 'NO_USER_FOUND', 'User Error');
  }
  const list = await prisma.restaurants.findMany({
    where: {
      user_id: userId,
      franchiseId: franchiseId,
    },
    include: {
      restaurant_categories: true,
    },
  });
  res.status(200).json(list);
});

export default list;
