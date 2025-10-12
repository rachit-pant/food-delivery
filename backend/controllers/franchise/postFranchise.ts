import type { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { BetterError } from '../../middleware/errorHandler.js';
import prisma from '../../prisma/client.js';

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
    const restaurants = image
      ? JSON.parse(req.body.restaurants)
      : req.body.restaurants;
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

export default postFranchise;
