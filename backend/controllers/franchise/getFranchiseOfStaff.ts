import expressAsyncHandler from 'express-async-handler';
import prisma from '../../prisma/client';
import { Request, Response } from 'express';
const { BetterError } = require('../../middleware/errorHandler');

const getFranchiseOfStaff = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const roleId = req.user?.role;
    if (!userId) {
      throw new BetterError(
        'no user found',
        400,
        'NO_USER_FOUND',
        'User Error'
      );
    }
    if (roleId !== 4) {
      throw new BetterError(
        'no user found',
        400,
        'NO_USER_FOUND',
        'User Error'
      );
    }
    const staff = await prisma.staff.findFirst({
      where: {
        userId: userId,
      },
    });
    if (!staff) {
      throw new BetterError(
        'Staff record not found',
        404,
        'STAFF_NOT_FOUND',
        'User Error'
      );
    }
    const franchise = await prisma.franchise.findMany({
      where: {
        franchise_staff: {
          some: {
            staffId: staff.id,
            isActive: true,
          },
        },
      },
      include: {
        franchise_staff: {
          where: {
            isActive: true,
            staffId: staff.id,
          },
          select: {
            staffRole: true,
          },
        },
      },
    });
    const formatted = franchise.map((f) => ({
      id: f.id,
      name: f.name,
      image_url: f.image_url,
      status: f.status,
      roleId: f.franchise_staff[0]?.staffRole.id,
      role: f.franchise_staff[0]?.staffRole.role,
    }));
    res.status(200).json(formatted);
  }
);
module.exports = getFranchiseOfStaff;
