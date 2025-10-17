import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '../../generated/prisma/index.js';
import { z } from 'zod';
import { BetterError } from '../../middleware/errorHandler.js';
interface RestaurantTiming {
  id: number;
  restaurant_id: number;
  week_day: string;
  start_time: Date;
  end_time: Date;
}
function isRestaurantOpen(timings: RestaurantTiming[], now: Date): boolean {
  if (!timings || timings.length === 0) return false;

  return timings.some((timing) => {
    const start = new Date(timing.start_time);
    const end = new Date(timing.end_time);

    const todayStart = new Date(now);
    todayStart.setHours(start.getHours(), start.getMinutes(), 0, 0);

    const todayEnd = new Date(now);
    todayEnd.setHours(end.getHours(), end.getMinutes(), 0, 0);

    if (todayEnd <= todayStart) {
      todayEnd.setDate(todayEnd.getDate() + 1);
    }

    return now >= todayStart && now <= todayEnd;
  });
}
const prisma = new PrismaClient();

const PopularDish = asyncHandler(async (req: Request, res: Response) => {
  const schema = z.object({
    menuName: z.string(),
    country: z.string(),
    filter: z.string(),
  });
  const validation = schema.safeParse({
    menuName: req.params.menuName,
    country: req.query.country as string,
    filter: req.query.filter as string,
  });
  if (!validation.success) {
    throw new BetterError(
      'Invalid menu name',
      400,
      'INVALID_MENU_NAME',
      'Query Error'
    );
  }
  const Name = validation.data.menuName;
  const country = validation.data.country;
  const filter = validation.data.filter;
  const filters: any = {};
  if (filter && filter !== 'None') {
    filters.rating = { gte: Number(filter) };
  }
  if (country) {
    filters.cities = {
      states: {
        countries: { country_name: country },
      },
    };
  }
  if (Name) {
    filters.name = {
      contains: Name,
      mode: 'insensitive',
    };
  }
  const PopularDish = await prisma.restaurants.findMany({
    where: filters,
    include: { restaurant_timings: true },
  });
  const now = new Date();
  const todayWeekDay = now.toLocaleDateString('en-US', { weekday: 'long' });

  const response = PopularDish.map((res) => {
    const todayTimings = res.restaurant_timings.filter(
      (t) => t.week_day === todayWeekDay
    );
    const open = isRestaurantOpen(todayTimings, now);
    return { ...res, is_open: open };
  });

  res.json(response);
});

export default PopularDish;
