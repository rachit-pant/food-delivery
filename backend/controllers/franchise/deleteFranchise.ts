import type { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { BetterError } from '../../middleware/errorHandler.js';
import prisma from '../../prisma/client.js';
import { z } from 'zod';

const deleteFranchise = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const schema = z.object({
      restaurantId: z.coerce.number(),
    });
    const validation = schema.safeParse(req.params);
    if (!validation.success) {
      throw new BetterError(
        'Invalid restaurantId',
        400,
        'INVALID_RESTAURANT_ID',
        'Restaurant Error'
      );
    }
    const { restaurantId } = validation.data;
    const userId = Number(req.user?.id);
    if (!userId) {
      throw new BetterError(
        'no user id found',
        400,
        'NO_USER_ID_FOUND',
        'User Error'
      );
    }
    const franchise = await prisma.franchise.delete({
      where: {
        id: restaurantId,
      },
    });
    res.status(200).json(franchise);
  }
);

export default deleteFranchise;
