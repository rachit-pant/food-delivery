import prisma from '../../prisma/client';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
const { BetterError } = require('../../middleware/errorHandler');
const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id) {
    throw new BetterError('Wrong id', 404, 'WRONG_ID', 'User Error');
  }
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
    throw new BetterError(
      'User not deleted',
      404,
      'USER_NOT_DELETED',
      'User Error'
    );
  }
});

module.exports = deleteUser;
