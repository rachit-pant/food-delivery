import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import _ from 'lodash';

const { groupBy } = _;
import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

export const MerchantGetRestro = asyncHandler(
  async (req: Request, res: Response) => {
    const GetMenus = await prisma.restaurants.findMany({
      where: {
        user_id: Number(req.user?.id),
      },
      select: {
        id: true,
        name: true,
        address: true,
        rating: true,
        imageurl: true,
        cities: {
          select: {
            city_name: true,
            states: {
              select: {
                state_name: true,
                countries: {
                  select: {
                    country_name: true,
                  },
                },
              },
            },
          },
        },
        restaurant_timings: {
          select: {
            restaurant_id: true,
            week_day: true,
            start_time: true,
            end_time: true,
            id: true,
          },
        },
      },
    });
    res.status(200).json(GetMenus);
  }
);

export const MerchantGetMenus = asyncHandler(
  async (req: Request, res: Response) => {
    const resId = Number(req.params.restaurantId);
    const GetMenus = await prisma.menus.findMany({
      where: {
        restaurant_id: resId,
      },
      include: {
        menu_categories: true,
        menu_variants: true,
      },
    });
    const groupedMenus = groupBy(
      GetMenus,
      (Menus) => Menus.menu_categories?.cat_name
    );
    res.status(200).json(groupedMenus);
  }
);
