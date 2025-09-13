import expressAsyncHandler from 'express-async-handler';
import prisma from '../../prisma/client';
import { Request, Response } from 'express';
const { BetterError } = require('../../middleware/errorHandler');
const allowedPlans = [8, 9, 11, 12];
const Dashboard = expressAsyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const franchiseId = Number(req.params.franchiseId);
  if (!userId || !franchiseId) {
    const error = new Error('no user found');
    (error as any).statusCode = 400;
    throw error;
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
    } catch (error) {
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
module.exports = Dashboard;
