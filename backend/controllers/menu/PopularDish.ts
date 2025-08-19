import { error } from 'console';
import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
const prisma = new PrismaClient();

const PopularDish = asyncHandler(async (req: Request, res: Response) => {
  const Name = req.params.menuName;

  const PopularDish = await prisma.restaurants.findMany({
    where: {
      name: {
        contains: Name,
        mode: 'insensitive',
      },
    },
  });

  res.json(PopularDish);
});

module.exports = PopularDish;
