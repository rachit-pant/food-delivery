import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
const { BetterError } = require('../../middleware/errorHandler');
const prisma = new PrismaClient();
const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.users.findMany();
  res.status(200).json(user);
});

const getUser = asyncHandler(async (req: Request, res: Response) => {
  const Id = Number(req.user?.id);
  if (!Id) {
    throw new BetterError('Wrong id', 404, 'WRONG_ID', 'User Error');
  }

  const reqUser = await prisma.users.findUnique({
    where: {
      id: Id,
    },

    select: {
      full_name: true,
      email: true,
      user_roles: {
        select: {
          role_name: true,
        },
      },
    },
  });
  if (!reqUser) {
    throw new BetterError(
      'User not found',
      404,
      'USER_NOT_FOUND',
      'User Error'
    );
  }
  res.status(200).json(reqUser);
});
module.exports = { getUsers, getUser };
