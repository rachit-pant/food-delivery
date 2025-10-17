import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { BetterError } from '../../middleware/errorHandler.js';
import prisma from '../../prisma/client.js';
import { z } from 'zod';

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const schema = z.object({
    id: z.coerce.number(),
  });
  const validation = schema.safeParse(req.params);
  if (!validation.success) {
    throw new BetterError('Wrong id', 404, 'WRONG_ID', 'User Error');
  }
  const id = validation.data.id;
  try {
    await prisma.users.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      message: 'deleted user successfully',
    });
  } catch (_err) {
    throw new BetterError(
      'User not deleted',
      404,
      'USER_NOT_DELETED',
      'User Error'
    );
  }
});

export default deleteUser;
