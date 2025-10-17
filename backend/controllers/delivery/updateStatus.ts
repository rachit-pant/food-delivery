import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { BetterError } from '../../middleware/errorHandler.js';
import prisma from '../../prisma/client.js';
import { z } from 'zod';
export const updateStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const schema = z.object({
      status: z.coerce.number(),
    });
    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      throw new BetterError(
        'Invalid status',
        400,
        'INVALID_STATUS',
        'Delivery Agent Error'
      );
    }
    const status = validation.data.status === 1 ? 'ACTIVE' : 'BUSY';
    if (!userId) {
      throw new BetterError(
        'User not found',
        404,
        'USER_NOT_FOUND',
        'User Error'
      );
    }
    try {
      const deliveryAgent = await prisma.delivery_agents.update({
        where: { user_id: userId },
        data: {
          status: status,
        },
      });
      res.status(200).json(deliveryAgent);
    } catch (_err) {
      throw new BetterError(
        'Delivery agent not found',
        404,
        'DELIVERY_AGENT_NOT_FOUND',
        'Delivery Agent Error'
      );
    }
  }
);

export const getStatus = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new BetterError(
      'User not found',
      404,
      'USER_NOT_FOUND',
      'User Error'
    );
  }
  try {
    const deliveryAgent = await prisma.delivery_agents.findUnique({
      where: { user_id: userId },
      select: {
        status: true,
        id: true,
      },
    });
    res.status(200).json(deliveryAgent);
  } catch (_err) {
    throw new BetterError(
      'Delivery agent not found',
      404,
      'DELIVERY_AGENT_NOT_FOUND',
      'Delivery Agent Error'
    );
  }
});
