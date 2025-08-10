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
  });
  if (!reqUser) {
    const err = new Error('User not found');
    (err as any).statusCode = 404;
    throw err;
  }
  res.json({
    id: reqUser.role_id,
    name: reqUser.full_name,
  });
});
module.exports = { getUsers, getUser };
