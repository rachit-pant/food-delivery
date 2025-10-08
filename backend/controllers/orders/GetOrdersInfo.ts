import prisma from '../../prisma/client';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
const { BetterError } = require('../../middleware/errorHandler');

const GetOrdersInfo = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const orderId = Number(req.params.orderId);
  try {
    const order = await prisma.orders.findUnique({
      where: {
        id: orderId,
        user_id: userId,
      },
      include: {
        order_items: true,
        order_payments: true,
      },
    });
    res.status(200).json(order);
  } catch (error) {
    throw new BetterError(
      'Order not found',
      404,
      'ORDER_NOT_FOUND',
      'Order Error'
    );
  }
});

module.exports = GetOrdersInfo;
