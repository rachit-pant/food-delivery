import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { BetterError } from '../../middleware/errorHandler.js';
import prisma from '../../prisma/client.js';
import { z } from 'zod';

export const getStaff = asyncHandler(async (_req: Request, res: Response) => {
  const staff = await prisma.staff.findMany();
  res.status(200).json(staff);
});

export const StaffNotFranchise = asyncHandler(
  async (req: Request, res: Response) => {
    const schema = z.object({
      staffId: z.coerce.number(),
    });
    const validation = schema.safeParse(req.params);
    if (!validation.success) {
      throw new BetterError(
        'Invalid staffId',
        400,
        'INVALID_STAFF_ID',
        'Staff Error'
      );
    }
    const { staffId } = validation.data;
    const userId = Number(req.user?.id);
    if (!userId) {
      throw new BetterError(
        'no user id found',
        400,
        'NO_USER_ID_FOUND',
        'User Error'
      );
    }
    const franchise = await prisma.franchise.findMany({
      where: {
        userId: userId,
        franchise_staff: {
          none: {
            staffId: staffId,
            isActive: true,
          },
        },
      },
    });
    res.status(200).json(franchise);
  }
);
