import type { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { PrismaClient } from '../../generated/prisma/index.js';
import { BetterError } from '../../middleware/errorHandler.js';
import { z } from 'zod';
const prisma = new PrismaClient();
export const getItemsReviews = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const Id = req.user?.id;
    const schema = z.object({
      restaurantId: z.coerce.number(),
    });
    const validation = schema.safeParse(req.params);
    if (!validation.success) {
      throw new BetterError(
        'Restaurant ID is required',
        400,
        'RESTAURANT_ID_REQUIRED',
        'Query Error'
      );
    }
    const resId = validation.data.restaurantId;
    const getReview = await prisma.reviews.findMany({
      where: {
        restaurant_id: resId,
        user_id: Id,
      },
      select: {
        order_id: true,
      },
    });
    const review = new Set(getReview.map((review) => review.order_id));
    const getItemsReviews = await prisma.order_items.findMany({
      where: {
        orders: {
          user_id: Id,
          restaurant_id: resId,
        },
      },

      select: {
        order_id: true,
        product_name: true,
        menu_variants: {
          select: {
            variety_name: true,
          },
        },
      },
    });

    const realReviews = getItemsReviews.filter(
      (item) => !review.has(item.order_id as number)
    );
    res.status(200).json(realReviews);
  }
);

export const postItemReviews = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const schema = z.object({
      orderId: z.coerce.number(),
      restaurantId: z.coerce.number(),
      review: z.string(),
      rating: z.coerce.number(),
    });
    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      throw new BetterError(
        'Order ID and Restaurant ID are required',
        400,
        'ORDER_ID_AND_RESTAURANT_ID_REQUIRED',
        'Query Error'
      );
    }
    const userId = Number(req.user?.id);
    const { review, rating } = validation.data;
    const orderId = validation.data.orderId;
    const restaurantId = validation.data.restaurantId;

    await prisma.reviews.create({
      data: {
        user_id: userId,
        order_id: orderId,
        rating: rating,
        review: review,
        restaurant_id: restaurantId,
      },
    });

    res.status(201).json({ message: 'Review added successfully' });
  }
);
export const showReviews = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const schema = z.object({
      restaurantId: z.coerce.number(),
    });
    const validation = schema.safeParse(req.params);
    if (!validation.success) {
      throw new BetterError(
        'Restaurant ID is required',
        400,
        'RESTAURANT_ID_REQUIRED',
        'Query Error'
      );
    }
    const resId = validation.data.restaurantId;
    const showReviews = await prisma.reviews.findMany({
      where: {
        restaurant_id: resId,
      },
      select: {
        id: true,
        review: true,
        rating: true,
        user: {
          select: {
            full_name: true,
          },
        },
        order: {
          select: {
            order_items: {
              select: {
                product_name: true,
                menus: {
                  select: {
                    image_url: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    res.status(200).json(showReviews);
  }
);
