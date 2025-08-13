import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
const prisma = new PrismaClient();
const DeleteAddress = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const addressId = Number(req.params.addressId);
  if (!id || !addressId) {
    const error = new Error('no user found');
    (error as any).statusCode = 400;
    throw error;
  }
  await prisma.user_addresses.deleteMany({
    where: {
      id: addressId,
      user_id: id,
    },
  });
  res.status(200).json({
    message: 'deleted success',
  });
});

module.exports = DeleteAddress;
