import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { BetterError } from '../../middleware/errorHandler.js';
import prisma from '../../prisma/client.js';
import { z } from 'zod';

const GetOrdersInfo = asyncHandler(async (req: Request, res: Response) => {
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
  try {
    const order = await prisma.orders.findUnique({
      where: {
        id: orderId,
      },
      include: {
        order_items: true,
        order_payments: true,
      },
    });
    res.status(200).json(order);
  } catch (_error) {
    throw new BetterError(
      'Order not found',
      404,
      'ORDER_NOT_FOUND',
      'Order Error'
    );
  }
});

export default GetOrdersInfo;
