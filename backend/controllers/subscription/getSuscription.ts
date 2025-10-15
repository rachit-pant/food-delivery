import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { BetterError } from '../../middleware/errorHandler.js';
import prisma from '../../prisma/client.js';

const GetSubscription = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.user?.id);
  if (!id) {
    throw new BetterError('wrong id', 400, 'WRONG_ID', 'Error');
  }
  const subscription = await prisma.sub.findFirst({
    where: {
      user_id: id,
      isDefault: true,
      status: 'active',
    },
    select: {
      user_id: true,
    },
  });
  if (!subscription) {
    throw new BetterError(
      'no subscription found',
      400,
      'NO_SUBSCRIPTION_FOUND',
      'Error'
    );
  }
  res.status(200).json(subscription);
});

export default GetSubscription;
