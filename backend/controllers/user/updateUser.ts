import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
const prisma = new PrismaClient();
const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const Id = Number(req.params.id);
  const user = await prisma.users.findUnique({
    where: {
      id: Id,
    },
  });
  if (!user) {
    const error = new Error('no user found');
    (error as any).statusCode = 404;
    throw error;
  }
  const UpdatedUser = await prisma.users.update({
    where: {
      id: Id,
    },
    data: {
      full_name: req.body.full_name || user.full_name,
      phone_number: req.body.phone_number || user.phone_number,
    },
  });
  res.status(200).json({
    message: 'user updated successfully',
    data: {
      email: UpdatedUser.email,
      full_name: UpdatedUser.full_name,
    },
  });
});

module.exports = updateUser;
