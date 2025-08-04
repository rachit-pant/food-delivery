import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
const prisma = new PrismaClient();
const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await prisma.users.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      message: 'deleted user successfully',
    });
  } catch (err) {
    throw new Error('no user found');
  }
});

module.exports = deleteUser;
