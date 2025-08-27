import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

const prisma = new PrismaClient();

const createAddr = asyncHandler(async (req: Request, res: Response) => {
  const Id = req.user?.id;
  const { address, city_id } = req.body;

  if (!address || !city_id) {
    const error = new Error('Address and City ID are required');
    (error as any).statusCode = 400;
    throw error;
  }
  const findAddress = await prisma.user_addresses.findMany({
    where: {
      user_id: Id,
    },
  });
  if (findAddress.length > 0) {
    const newAddress = await prisma.user_addresses.create({
      data: {
        user_id: Id,
        address,
        city_id: Number(city_id),
        is_default: false,
      },
    });

    res.status(201).json({
      message: 'Address created successfully',
      data: newAddress,
    });
    return;
  }
  const newAddress = await prisma.user_addresses.create({
    data: {
      user_id: Id,
      address,
      city_id: Number(city_id),
      is_default: true,
    },
  });

  res.status(201).json({
    message: 'Address created successfully',
    data: newAddress,
  });
});

module.exports = createAddr;
