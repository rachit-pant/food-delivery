import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '../../generated/prisma/index.js';
import { z } from 'zod';
import { BetterError } from '../../middleware/errorHandler.js';
const prisma = new PrismaClient();

const DeleteCart = asyncHandler(async (req: Request, res: Response) => {
  const schema = z.object({
    itemId: z.coerce.number(),
  });
  const validation = schema.safeParse(req.params);
  if (!validation.success) {
    throw new BetterError(
      'Invalid item id',
      400,
      'INVALID_ITEM_ID',
      'Cart Error'
    );
  }
  const DeleteCart = await prisma.carts.deleteMany({
    where: {
      user_id: req.user?.id,
      menu_id: validation.data.itemId,
    },
  });
  if (!DeleteCart) {
    throw new BetterError('no user found', 400, 'NO_USER_FOUND', 'User Error');
  }
  res.status(200).json({
    message: 'Deleted Succes',
  });
});

export default DeleteCart;
