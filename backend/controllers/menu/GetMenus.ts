import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import groupBy from 'lodash/groupBy';
const prisma = new PrismaClient();

const GetMenus = asyncHandler(async (req: Request, res: Response) => {
  const restaurant_id = Number(req.params.restaurantId);
  const GetMenus = await prisma.menus.findMany({
    where: {
      restaurant_id,
    },
    include: {
      menu_categories: true,
    },
  });
  if (!GetMenus) {
    const error = new Error('no mennus found');
    (error as any).statusCode = 400;
    throw error;
  }
  const groupedMenus = groupBy(
    GetMenus,
    (Menus) => Menus.menu_categories?.cat_name
  );
  res.status(200).json(groupedMenus);
});

module.exports = GetMenus;
