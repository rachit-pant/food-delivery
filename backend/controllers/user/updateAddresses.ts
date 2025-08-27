import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
const prisma = new PrismaClient();

const updateAddress = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const addressId = Number(req.params.addressId);
  if (!id || !addressId) {
    const error = new Error('no user found');
    (error as any).statusCode = 400;
    throw error;
  }
  const findAddress = await prisma.user_addresses.updateMany({
    where: {
      is_default: true,
      user_id: id,
    },
    data: {
      is_default: false,
    },
  });
  if (!findAddress) {
    const error = new Error('no address found');
    (error as any).statusCode = 404;
    throw error;
  }

  const updatedAddress = await prisma.user_addresses.update({
    where: {
      id: addressId,
      user_id: id,
    },
    data: {
      is_default: true,
    },
  });

  res.status(200).json({
    message: 'Address updated successfully',
    data: updatedAddress,
  });
});

module.exports = updateAddress;
