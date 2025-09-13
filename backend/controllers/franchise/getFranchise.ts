import expressAsyncHandler from 'express-async-handler';
import prisma from '../../prisma/client';
import { Request, Response } from 'express';
const { BetterError } = require('../../middleware/errorHandler');

const getSelectedRestaurants = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new BetterError(
        'no user found',
        400,
        'NO_USER_FOUND',
        'User Error'
      );
    }
    const restaurants = await prisma.restaurants.findMany({
      where: {
        user_id: userId,
        franchiseId: null,
      },
      select: {
        id: true,
        name: true,
      },
    });
    res.status(200).json(restaurants);
  }
);
const getFranchise = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new BetterError(
        'no user found',
        400,
        'NO_USER_FOUND',
        'User Error'
      );
    }
    try {
      const franchise = await prisma.franchise.findMany({
        where: {
          userId,
        },
      });
      res.status(200).json(franchise);
    } catch (error) {
      throw new BetterError(
        'no franchise found',
        400,
        'NO_FRANCHISE_FOUND',
        'Franchise Error'
      );
    }
  }
);

module.exports = { getSelectedRestaurants, getFranchise };
