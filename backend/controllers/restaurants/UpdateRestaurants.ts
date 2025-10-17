import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '../../generated/prisma/index.js';
import { z } from 'zod';
import { BetterError } from '../../middleware/errorHandler.js';
const prisma = new PrismaClient();

const UpdateRestro = asyncHandler(async (req: Request, res: Response) => {
  const schema = z.object({
    restaurantId: z.coerce.number(),
  });
  const validation = schema.safeParse(req.params);
  if (!validation.success) {
    throw new BetterError('no id found', 404, 'NO_ID_FOUND', 'Query Error');
  }
  const id = validation.data.restaurantId;
  const UpdateRestro = await prisma.restaurants.update({
    where: {
      id,
    },
    data: {
      name: req.body.name,
      address: req.body.address,
      city_id: Number(req.body.city_id),
      status: req.body.status,
    },
  });
  if (!UpdateRestro) {
    throw new BetterError('no id found', 404, 'NO_ID_FOUND', 'Query Error');
  }
  res.status(200).json(UpdateRestro);
});

export default UpdateRestro;
