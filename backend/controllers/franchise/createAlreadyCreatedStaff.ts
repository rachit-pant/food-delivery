import expressAsyncHandler from 'express-async-handler';
import prisma from '../../prisma/client';
import { Request, Response } from 'express';
const { BetterError } = require('../../middleware/errorHandler');

const createAlreadyCrestedStaff = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { staffId, franchiseId, roleId } = req.body;
    if (!staffId || !franchiseId || !roleId) {
      throw new BetterError(
        'Invalid Request',
        400,
        'INVALID_REQUEST',
        'Missing required fields'
      );
    }
    const existingStaff = await prisma.franchiseStaff.findFirst({
      where: {
        staffId: Number(staffId),
        franchiseId: Number(franchiseId),
        staffRoleId: Number(roleId),
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
        staffId: Number(staffId),
        franchiseId: Number(franchiseId),
        staffRoleId: Number(roleId),
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

module.exports = createAlreadyCrestedStaff;
