import expressAsyncHandler from 'express-async-handler';
import prisma from '../../prisma/client';
import { Request, Response } from 'express';
const { BetterError } = require('../../middleware/errorHandler');

const deleteFranchise = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const restaurantId = Number(req.params.restaurantId);
    const userId = Number(req.user?.id);
    if (!restaurantId || !userId) {
      throw new BetterError(
        'no restaurant id or user id found',
        400,
        'NO_RESTAURANT_ID_OR_USER_ID_FOUND',
        'Restaurant Error'
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
module.exports = deleteFranchise;
