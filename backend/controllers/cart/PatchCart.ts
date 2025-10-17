import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '../../generated/prisma/index.js';
import { z } from 'zod';
import { BetterError } from '../../middleware/errorHandler.js';
const prisma = new PrismaClient();

const PatchCart = asyncHandler(async (req: Request, res: Response) => {
  const schema = z.object({
    cartId: z.coerce.number(),
    quantity: z.coerce.number(),
  });
  const validation = schema.safeParse({
    cartId: req.params.cartId,
    quantity: req.body.quantity,
  });
  if (!validation.success) {
    throw new BetterError(
      'Invalid cart id or quantity',
      400,
      'INVALID_CART_ID_OR_QUANTITY',
      'Cart Error'
    );
  }
  if (validation.data.quantity === 0) {
    await prisma.carts.delete({
      where: {
        id: validation.data.cartId,
      },
    });
  } else {
    await prisma.carts.update({
      where: {
        user_id: req.user?.id,
        id: validation.data.cartId,
      },
      data: {
        quantity: validation.data.quantity,
      },
    });
  }
  res.status(200).json({
    message: 'changed successfully',
  });
});

export default PatchCart;
