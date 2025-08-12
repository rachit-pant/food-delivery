import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
const prisma = new PrismaClient();
const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.users.findMany();
  res.json(user);
});

const getUser = asyncHandler(async (req: Request, res: Response) => {
  const Id = Number(req.user?.id);
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
    const err = new Error('User not found');
    (err as any).statusCode = 404;
    throw err;
  }
  res.json(reqUser);
});
module.exports = { getUsers, getUser };
