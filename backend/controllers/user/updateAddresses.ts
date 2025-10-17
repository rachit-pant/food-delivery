import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '../../generated/prisma/index.js';
import { z } from 'zod';
import { BetterError } from '../../middleware/errorHandler.js';

const prisma = new PrismaClient();

const updateAddress = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const schema = z.object({
    addressId: z.coerce.number(),
  });
  const validation = schema.safeParse(req.params);
  if (!validation.success) {
    throw new BetterError('no user found', 400, 'BAD_REQUEST', 'User Error');
  }
  const { addressId } = validation.data;
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
    throw new BetterError('no address found', 404, 'NOT_FOUND', 'User Error');
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

export default updateAddress;
