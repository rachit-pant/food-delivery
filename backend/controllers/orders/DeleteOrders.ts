import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '../../generated/prisma/index.js';
import { z } from 'zod';
import { BetterError } from '../../middleware/errorHandler.js';

const prisma = new PrismaClient();

const DeleteOrder = asyncHandler(async (req: Request, res: Response) => {
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
  await prisma.orders.update({
    where: {
      id: orderId,
    },
    data: {
      status: 'cancelled',
    },
  });
  res.status(200).json({
    message: 'deleted',
  });
});

export default DeleteOrder;
