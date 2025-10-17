import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '../../generated/prisma/index.js';
import { z } from 'zod';
import { BetterError } from '../../middleware/errorHandler.js';

const prisma = new PrismaClient();

const DeleteRestro = asyncHandler(async (req: Request, res: Response) => {
  const schema = z.object({
    restaurantId: z.coerce.number(),
  });
  const validation = schema.safeParse(req.params);
  if (!validation.success) {
    throw new BetterError('no id exists', 400, 'NO_ID_EXISTS', 'Query Error');
  }
  const id = validation.data.restaurantId;
  const DeleteRestro = await prisma.restaurants.delete({
    where: {
      id,
    },
  });
  if (!DeleteRestro) {
    throw new BetterError('server error', 500, 'SERVER_ERROR', 'Server Error');
  }
  res.status(200).json({
    message: `Deleted succesfully ${id}`,
  });
});

export default DeleteRestro;
