import prisma from '../../prisma/client';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import myQueue from '../../Redis/queues/DeliveryQueue';
const { BetterError } = require('../../middleware/errorHandler');

const updateOrders = asyncHandler(async (req: Request, res: Response) => {
  const orderId = Number(req.params.orderId);
  try {
    const order = await prisma.orders.update({
      where: {
        id: orderId,
      },
      data: {
        status: 'prepared',
      },
    });
    myQueue.add(`assign_order_${order.id}`, { orderId: order.id });
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
const updateOrdersToDelivered = asyncHandler(
  async (req: Request, res: Response) => {
    const orderId = Number(req.params.orderId);
    const userId = Number(req.user?.id);
    try {
      const order = await prisma.orders.update({
        where: {
          id: orderId,
        },
        data: {
          delivery_agent_id: userId,
          status: 'picked',
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
  }
);
module.exports = { updateOrders, updateOrdersToDelivered };
