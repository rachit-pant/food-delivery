import type { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { BetterError } from '../../middleware/errorHandler.js';
import prisma from '../../prisma/client.js';
import { z } from 'zod';
const deleteRestro = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const schema = z.object({
      restaurantId: z.coerce.number(),
      franchiseId: z.coerce.number(),
    });
    const validation = schema.safeParse(req.params);
    if (!validation.success) {
      throw new BetterError(
        'Invalid restaurantId or franchiseId',
        400,
        'INVALID_RESTAURANT_ID_OR_FRANCHISE_ID',
        'Restaurant Error'
      );
    }
    const { restaurantId, franchiseId } = validation.data;
    const userId = Number(req.user?.id);
    if (!userId) {
      throw new BetterError(
        'no user id found',
        400,
        'NO_USER_ID_FOUND',
        'User Error'
      );
    }
    const totalRestaurants = await prisma.restaurants.findMany({
      where: {
        franchiseId: franchiseId,
        user_id: userId,
      },
    });
    if (totalRestaurants.length === 1) {
      await prisma.restaurants.update({
        where: {
          id: restaurantId,
        },
        data: {
          franchiseId: null,
        },
      });
      const franchise = await prisma.franchise.delete({
        where: {
          id: franchiseId,
        },
      });
      res.status(200).json(franchise);
      return;
    }
    const restro = await prisma.restaurants.update({
      where: {
        id: restaurantId,
      },
      data: {
        franchiseId: null,
      },
    });
    res.status(200).json(restro);
  }
);

export default deleteRestro;
