import type { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { BetterError } from '../../middleware/errorHandler.js';
import prisma from '../../prisma/client.js';
import { z } from 'zod';

const deleteFranchiseStaff = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const schema = z.object({
      franchiseStaffId: z.coerce.number(),
    });
    const validation = schema.safeParse(req.params);
    if (!validation.success) {
      throw new BetterError(
        'Invalid franchiseStaffId',
        400,
        'INVALID_FRANCHISE_STAFF_ID',
        'Franchise Staff Error'
      );
    }
    const { franchiseStaffId } = validation.data;
    const userId = Number(req.user?.id);
    if (!userId) {
      throw new BetterError(
        'no user id found',
        400,
        'NO_USER_ID_FOUND',
        'User Error'
      );
    }
    const franchiseStaff = await prisma.franchiseStaff.update({
      where: {
        id: franchiseStaffId,
      },
      data: {
        isActive: false,
      },
    });
    res.status(200).json(franchiseStaff);
  }
);

export default deleteFranchiseStaff;
