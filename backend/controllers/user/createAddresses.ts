import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { BetterError } from '../../middleware/errorHandler.js';
import prisma from '../../prisma/client.js';
import { z } from 'zod';
const createAddr = asyncHandler(async (req: Request, res: Response) => {
  const Id = Number(req.user?.id);
  const schema = z.object({
    address: z.string(),
    city_id: z.coerce.number(),
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
  });
  const validation = schema.safeParse(req.body);
  if (!validation.success) {
    throw new BetterError(
      'Address and City ID are required',
      400,
      'BAD_REQUEST',
      'User Error'
    );
  }
  const { address } = validation.data;
  const city_id = validation.data.city_id;
  const { latitude, longitude } = validation.data;

  if (!address || !city_id) {
    throw new BetterError(
      'Address and City ID are required',
      400,
      'BAD_REQUEST',
      'User Error'
    );
  }
  if (!latitude || !longitude) {
    throw new BetterError(
      'Latitude and longitude are required',
      400,
      'BAD_REQUEST',
      'User Error'
    );
  }
  if (!Id) {
    throw new BetterError('Wrong id', 404, 'WRONG_ID', 'User Error');
  }
  try {
    const findAddress = await prisma.user_addresses.findMany({
      where: {
        user_id: Id,
      },
    });
    const newAddress = await prisma.user_addresses.create({
      data: {
        user_id: Id,
        address,
        city_id,
        is_default: findAddress.length === 0,
        lat: latitude,
        lng: longitude,
      },
    });

    res.status(201).json({
      message: 'Address created successfully',
      data: newAddress,
    });
  } catch (_error) {
    throw new BetterError(
      'Address not created',
      500,
      'ADDRESS_NOT_CREATED',
      'User Error'
    );
  }
});

export default createAddr;
