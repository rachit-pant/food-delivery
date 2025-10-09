import prisma from '../../prisma/client';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
const { BetterError } = require('../../middleware/errorHandler');

const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  console.log(req.body.status);
  const status = Number(req.body.status) === 1 ? 'ACTIVE' : 'BUSY';
  console.log(status);
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
    if (!deliveryAgent) {
      throw new BetterError(
        'Delivery agent not found',
        404,
        'DELIVERY_AGENT_NOT_FOUND',
        'Delivery Agent Error'
      );
    }
    res.status(200).json(deliveryAgent);
  } catch (err) {
    throw err;
  }
});

const getStatus = asyncHandler(async (req: Request, res: Response) => {
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
    if (!deliveryAgent) {
      throw new BetterError(
        'Delivery agent not found',
        404,
        'DELIVERY_AGENT_NOT_FOUND',
        'Delivery Agent Error'
      );
    }
    res.status(200).json(deliveryAgent);
  } catch (err) {
    throw err;
  }
});
module.exports = { updateStatus, getStatus };
