import expressAsyncHandler from 'express-async-handler';
import prisma from '../../prisma/client';
import { Request, Response } from 'express';
const { BetterError } = require('../../middleware/errorHandler');

const list = expressAsyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const franchiseId = Number(req.params.franchiseId);
  console.log(franchiseId, userId);
  if (!userId || !franchiseId) {
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
module.exports = list;
