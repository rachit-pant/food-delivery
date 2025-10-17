import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import prisma from '../../prisma/client.js';
import { z } from 'zod';
import { BetterError } from '../../middleware/errorHandler.js';

const DeleteAddress = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.user?.id);
  const schema = z.object({
    addressId: z.coerce.number(),
  });
  const validation = schema.safeParse(req.params);
  if (!validation.success) {
    throw new BetterError('no input given', 400, 'BAD_REQUEST', 'User Error');
  }
  const addressId = validation.data.addressId;
  const address = await prisma.user_addresses.findFirst({
    where: {
      id: addressId,
      user_id: id,
    },
  });
  if (!address) {
    throw new BetterError(
      'no address found',
      404,
      'NO_ADDRESS_FOUND',
      'User Error'
    );
  }
  await prisma.user_addresses.delete({
    where: {
      id: addressId,
      user_id: id,
    },
  });
  if (address.is_default) {
    const another = await prisma.user_addresses.findFirst({
      where: {
        user_id: id,
      },
    });
    if (another) {
      await prisma.user_addresses.update({
        where: { id: another.id },
        data: { is_default: true },
      });
    }
  }
  res.status(200).json({
    message: 'Address deleted successfully',
  });
});

export default DeleteAddress;
