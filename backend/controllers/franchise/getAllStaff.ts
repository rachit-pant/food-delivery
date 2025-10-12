import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { BetterError } from '../../middleware/errorHandler.js';
import prisma from '../../prisma/client.js';

const getAllStaff = asyncHandler(async (req: Request, res: Response) => {
  const userId = Number(req.user?.id);
  if (!userId) {
    throw new BetterError(
      'Invalid Request',
      400,
      'INVALID_REQUEST',
      'Missing required fields'
    );
  }
  const staff = await prisma.franchiseStaff.findMany({
    where: {
      isActive: true,
      franchise: {
        userId: userId,
      },
    },
    include: {
      staff: true,
      staffRole: true,
      franchise: true,
    },
  });

  res.status(200).json(staff);
});

export default getAllStaff;
