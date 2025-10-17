import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '../../generated/prisma/index.js';
import { z } from 'zod';
import { BetterError } from '../../middleware/errorHandler.js';

const prisma = new PrismaClient();

const getSpecOrders = asyncHandler(async (req: Request, res: Response) => {
  const schema = z.object({
    orderId: z.coerce.number(),
  });
  const validation = schema.safeParse(req.params);
  if (!validation.success) {
    throw new BetterError(
      'Invalid order ID',
      400,
      'INVALID_ORDER_ID',
      'Query Error'
    );
  }
  const orderId = validation.data.orderId;
  const getSpecOrders = await prisma.orders.findMany({
    where: {
      user_id: req.user?.id,
      id: orderId,
    },
    include: {
      order_items: {
        include: {
          menus: true,
          menu_variants: true,
        },
      },
    },
  });
  if (!getSpecOrders) {
    throw new BetterError(
      'Order not found',
      404,
      'ORDER_NOT_FOUND',
      'Order Error'
    );
  }
  res.status(200).json(getSpecOrders);
});

export default getSpecOrders;
