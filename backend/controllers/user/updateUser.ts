import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const user = await prisma.users.findUnique({
    where: {
      id,
    },
  });
  if (!user) {
    const error = new Error('no user found');
    (error as any).statusCode = 404;
    throw error;
  }
  const updatedData: Partial<typeof user> = {
    full_name: user?.full_name,
    phone_number: user?.phone_number,
    password: user?.password,
  };
  if (
    typeof req.body.full_name === 'string' &&
    req.body.full_name.trim() !== ''
  ) {
    updatedData.full_name = req.body.full_name;
  }

  if (
    typeof req.body.phone_number === 'string' &&
    req.body.phone_number.trim() !== ''
  ) {
    updatedData.phone_number = req.body.phone_number;
  }

  if (
    typeof req.body.password === 'string' &&
    req.body.password.trim() !== ''
  ) {
    updatedData.password = await bcrypt.hash(req.body.password, 10);
  }

  const UpdatedUser = await prisma.users.update({
    where: { id },
    data: updatedData,
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
