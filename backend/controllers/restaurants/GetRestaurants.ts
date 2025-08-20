import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
const prisma = new PrismaClient();
const GetRestro = asyncHandler(async (req: Request, res: Response) => {
  const filter = req.query.filter as string;
  const country = req.query.country as string;

  if (!filter || filter === 'None') {
    const allRes = await prisma.restaurants.findMany({
      where: {
        cities: {
          states: {
            countries: {
              country_name: country,
            },
          },
        },
      },
    });
    res.status(200).json(allRes);
    return;
  }
  const rating = Number(filter);
  const filteredRes = await prisma.restaurants.findMany({
    where: {
      rating: {
        gte: rating,
      },
      cities: {
        states: {
          countries: {
            country_name: country,
          },
        },
      },
    },
  });
  res.status(200).json(filteredRes);
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
