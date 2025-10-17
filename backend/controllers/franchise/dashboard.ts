import type { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { BetterError } from '../../middleware/errorHandler.js';
import prisma from '../../prisma/client.js';
import { z } from 'zod';
const allowedPlans = [8, 9, 11, 12];
const Dashboard = expressAsyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const schema = z.object({
    franchiseId: z.coerce.number(),
  });
  const validation = schema.safeParse(req.params);
  if (!validation.success) {
    throw new BetterError(
      'Invalid franchiseId',
      400,
      'INVALID_FRANCHISE_ID',
      'Franchise Error'
    );
  }
  const { franchiseId } = validation.data;
  if (!userId) {
    throw new BetterError(
      'no user id found',
      400,
      'NO_USER_ID_FOUND',
      'User Error'
    );
  }
  const planId = await prisma.sub.findFirst({
    where: {
      user_id: userId,
      isDefault: true,
    },
    select: {
      plan_id: true,
    },
  });
  if (!planId) {
    throw new BetterError(
      'Upgrade Plan',
      404,
      'UPGRADE_PLAN',
      'Subscription Error'
    );
  }
  if (allowedPlans.includes(planId.plan_id)) {
    try {
      const orders = await prisma.orders.findMany({
        where: {
          restaurants: {
            user_id: userId,
            franchiseId: franchiseId,
          },
        },
        include: {
          order_items: true,
          restaurants: true,
        },
      });
      const restaurant = await prisma.restaurants.findMany({
        where: {
          user_id: userId,
          franchiseId: franchiseId,
        },
      });
      const totalRestaurant = restaurant.length;
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce(
        (total, order) => total + (order.total_amount ?? 0),
        0
      );
      const avgRating =
        restaurant.reduce(
          (total, restaurant) => total + (restaurant.rating ?? 3),
          0
        ) / restaurant.length;
      const avgPerRestaurant = totalRevenue / totalRestaurant;
      const restaurantData = restaurant.map((restaurant) => ({
        name: restaurant.name,
        image: restaurant.imageurl,
        id: restaurant.id,
      }));
      const dashboardData = {
        totalRestaurant,
        totalOrders,
        totalRevenue,
        avgRating,
        avgPerRestaurant,
        restaurantData,
        orders,
      };
      res.status(200).json(dashboardData);
    } catch (_error) {
      throw new BetterError(
        'Dashboard not found',
        500,
        'DASHBOARD_NOT_FOUND',
        'Dashboard Error'
      );
    }
  } else {
    throw new BetterError(
      'Upgrade Plan',
      500,
      'UPGRADE_PLAN',
      'Subscription Error'
    );
  }
});

export default Dashboard;
