import prisma from '../../prisma/client';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
const { BetterError } = require('../../middleware/errorHandler');

const getStaff = asyncHandler(async (req: Request, res: Response) => {
  const staff = await prisma.staff.findMany();
  res.status(200).json(staff);
});

const StaffNotFranchise = asyncHandler(async (req: Request, res: Response) => {
  const staffId = Number(req.params.staffId);
  const userId = Number(req.user?.id);
  if (!staffId || !userId) {
    throw new BetterError('Invalid staffId or userId', 400);
  }
  const franchise = await prisma.franchise.findMany({
    where: {
      userId: userId,
      franchise_staff: {
        none: {
          staffId: staffId,
        },
      },
    },
  });
  res.status(200).json(franchise);
});

module.exports = {
  getStaff,
  StaffNotFranchise,
};
