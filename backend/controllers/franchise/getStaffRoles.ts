import expressAsyncHandler from 'express-async-handler';
import prisma from '../../prisma/client';
import { Request, Response } from 'express';

const getStaffRoles = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const roles = await prisma.staffRole.findMany({
      select: {
        id: true,
        role: true,
      },
    });
    res.status(200).json(roles);
  }
);

module.exports = getStaffRoles;
