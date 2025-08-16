import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

const prisma = new PrismaClient();

const DeleteOrder = asyncHandler(async (req: Request, res: Response) => {
  const orderId = Number(req.params.orderId);
  try {
    await prisma.order_items.deleteMany({ where: { order_id: orderId } });
    await prisma.order_addresses.deleteMany({ where: { order_id: orderId } });
    await prisma.order_payments.deleteMany({ where: { order_id: orderId } });
    await prisma.orders.deleteMany({ where: { id: orderId } });
    res.status(200).json({
      message: 'deleted',
    });
  } catch (error) {
    throw error;
  }
});

module.exports = DeleteOrder;
