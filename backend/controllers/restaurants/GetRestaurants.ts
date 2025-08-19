import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
const prisma = new PrismaClient();
const GetRestro = asyncHandler(async (req: Request, res: Response) => {
  const AllRes = await prisma.restaurants.findMany();
  if (!AllRes) {
    const error = new Error('cant get all res');
    (error as any).statusCode = 400;
    throw error;
  }
  res.status(200).json(AllRes);
});
const GetPer = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.restaurantId);
  const GetPer = await prisma.restaurants.findUnique({
    where: {
      id,
    },
    include: {
      restaurant_timings: true,
      cities: {
        select: {
          city_name: true,
          states: {
            select: {
              state_name: true,
            },
          },
        },
      },
    },
  });
  if (!GetPer) {
    const error = new Error('no restro exists');
    (error as any).statusCode = 400;
    throw error;
  }
  res.status(200).json(GetPer);
});

module.exports = { GetRestro, GetPer };
