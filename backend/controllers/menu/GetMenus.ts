import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import _ from 'lodash';

const { groupBy } = _;
import { PrismaClient } from '../../generated/prisma/index.js';
import { z } from 'zod';
import { BetterError } from '../../middleware/errorHandler.js';

const prisma = new PrismaClient();

const GetMenus = asyncHandler(async (req: Request, res: Response) => {
  const schema = z.object({
    restaurantId: z.coerce.number(),
  });
  const validation = schema.safeParse(req.params);
  if (!validation.success) {
    throw new BetterError(
      'Invalid restaurant ID',
      400,
      'INVALID_RESTAURANT_ID',
      'Query Error'
    );
  }
  const restaurant_id = validation.data.restaurantId;
  const GetMenus = await prisma.menus.findMany({
    where: {
      restaurant_id,
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
});

export default GetMenus;
