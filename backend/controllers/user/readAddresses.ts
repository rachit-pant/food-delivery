import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
const prisma = new PrismaClient();
const readAddress = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id) {
    const error = new Error('no user found');
    (error as any).statusCode = 400;
    throw error;
  }
  const Addresses = await prisma.user_addresses.findMany({
    where: {
      user_id: id,
    },
    include: {
      cities: {
        include: {
          states: {
            include: {
              countries: true,
            },
          },
        },
      },
    },
  });
  res.status(200).json({
    message: 'all addresses',
    data: Addresses,
  });
});

module.exports = readAddress;
