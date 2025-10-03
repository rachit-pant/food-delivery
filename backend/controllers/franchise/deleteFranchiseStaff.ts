import expressAsyncHandler from 'express-async-handler';
import prisma from '../../prisma/client';
import { Request, Response } from 'express';
const { BetterError } = require('../../middleware/errorHandler');

const deleteFranchiseStaff = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const franchiseStaffId = Number(req.params.franchiseStaffId);
    const userId = Number(req.user?.id);
    if (!franchiseStaffId || !userId) {
      throw new BetterError(
        'no franchise staff id or user id found',
        400,
        'NO_FRANCHISE_STAFF_ID_OR_USER_ID_FOUND',
        'Franchise Staff Error'
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
module.exports = deleteFranchiseStaff;
