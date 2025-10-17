import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { BetterError } from '../../middleware/errorHandler.js';
import prisma from '../../prisma/client.js';
import myQueue from '../../Redis/queues/DeliveryQueue.js';
import { z } from 'zod';

export const updateOrders = asyncHandler(
  async (req: Request, res: Response) => {
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
      const order = await prisma.orders.update({
        where: {
          id: orderId,
        },
        data: {
          status: 'prepared',
        },
      });
      myQueue.add(
        `assign_order_${order.id}`,
        { orderId: order.id },
        {
          removeOnComplete: {
            age: 3600,
          },
        }
      );
      res.status(200).json(order);
    } catch (_error) {
      throw new BetterError(
        'Order not found',
        404,
        'ORDER_NOT_FOUND',
        'Order Error'
      );
    }
  }
);
export const updateOrdersToDelivered = asyncHandler(
  async (req: Request, res: Response) => {
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
    const userId = Number(req.user?.id);
    try {
      const order = await prisma.orders.update({
        where: {
          id: orderId,
        },
        data: {
          delivery_agents: {
            connect: {
              user_id: userId,
            },
          },
          status: 'picked',
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
  }
);
