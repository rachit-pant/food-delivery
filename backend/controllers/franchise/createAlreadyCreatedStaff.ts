import type { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { BetterError } from '../../middleware/errorHandler.js';
import prisma from '../../prisma/client.js';
import { z } from 'zod';
const createAlreadyCrestedStaff = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const schema = z.object({
      staffId: z.coerce.number(),
      franchiseId: z.coerce.number(),
      roleId: z.coerce.number(),
    });
    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      throw new BetterError(
        'Invalid Request',
        400,
        'INVALID_REQUEST',
        'Missing required fields'
      );
    }
    const existingStaff = await prisma.franchiseStaff.findFirst({
      where: {
        staffId: validation.data.staffId,
        franchiseId: validation.data.franchiseId,
        staffRoleId: validation.data.roleId,
        isActive: true,
      },
    });
    if (existingStaff) {
      throw new BetterError(
        'Staff already exists',
        400,
        'STAFF_EXISTS',
        'Staff already exists'
      );
    }
    const newStaff = await prisma.franchiseStaff.create({
      data: {
        staffId: validation.data.staffId,
        franchiseId: validation.data.franchiseId,
        staffRoleId: validation.data.roleId,
        isActive: true,
      },
    });
    res.status(200).json({
      success: true,
      message: 'Staff created successfully',
      data: newStaff,
    });
  }
);

export default createAlreadyCrestedStaff;
