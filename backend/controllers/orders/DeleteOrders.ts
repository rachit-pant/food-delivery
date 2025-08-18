import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

const prisma = new PrismaClient();

const DeleteOrder = asyncHandler(async (req: Request, res: Response) => {
  const orderId = Number(req.params.orderId);
  try {
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
  } catch (error) {
    throw error;
  }
});

module.exports = DeleteOrder;
