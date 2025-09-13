import expressAsyncHandler from 'express-async-handler';
import prisma from '../../prisma/client';
import { Request, Response } from 'express';
const { BetterError } = require('../../middleware/errorHandler');

const deleteRestro = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const restaurantId = Number(req.params.restaurantId);
    const franchiseId = Number(req.params.franchiseId);
    const userId = Number(req.user?.id);
    if (!restaurantId || !userId || !franchiseId) {
      throw new BetterError(
        'no restaurant id or user id found',
        400,
        'NO_RESTAURANT_ID_OR_USER_ID_FOUND',
        'Restaurant Error'
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
module.exports = deleteRestro;
