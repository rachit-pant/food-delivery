import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '../../generated/prisma/index.js';
import { z } from 'zod';
import { BetterError } from '../../middleware/errorHandler.js';

const prisma = new PrismaClient();

const PatchMenus = asyncHandler(async (req: Request, res: Response) => {
  const schema = z.object({
    menuId: z.coerce.number(),
  });
  const validation = schema.safeParse(req.params);
  if (!validation.success) {
    throw new BetterError(
      'Invalid menu ID',
      400,
      'INVALID_MENU_ID',
      'Query Error'
    );
  }
  const MenuId = validation.data.menuId;
  const PatchMenus = await prisma.menus.update({
    where: {
      id: MenuId,
    },
    data: {
      category_id: Number(req.body.category),
      item_name: req.body.item_name,
      description: req.body.description,
      image_url: req.body.photo,
      price: Number(req.body.price),
    },
  });

  res.status(200).json(PatchMenus);
});

export default PatchMenus;
