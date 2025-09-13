import expressAsyncHandler from 'express-async-handler';
import prisma from '../../prisma/client';
import { Request, Response } from 'express';
const { BetterError } = require('../../middleware/errorHandler');
interface restaurant {
  restaurant_id: number;
  restaurant_name: string;
}
const postFranchise = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { name } = req.body;
    const userId = Number(req.user?.id);
    if (!userId) {
      throw new BetterError(
        'no user found',
        400,
        'NO_USER_FOUND',
        'User Error'
      );
    }
    const image = req.file?.filename;
    let restaurants;
    if (image) {
      restaurants = JSON.parse(req.body.restaurants);
    } else {
      restaurants = req.body.restaurants;
    }
    console.log(restaurants);
    const franchise = await prisma.franchise.create({
      data: {
        name: name,
        image_url: `/images/${image}`,
        userId,
        restaurants: {
          connect: restaurants.map((r: restaurant) => ({
            id: Number(r.restaurant_id),
          })),
        },
      },
    });
    res.status(200).json(franchise);
  }
);
module.exports = postFranchise;
