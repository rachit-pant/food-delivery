import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '../../generated/prisma/index.js';
import { z } from 'zod';
import { BetterError } from '../../middleware/errorHandler.js';

const prisma = new PrismaClient();

const DeleteMenus = asyncHandler(async (req: Request, res: Response) => {
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
  const menuId = validation.data.menuId;
  const DeleteMenus = await prisma.menus.delete({
    where: {
      id: menuId,
    },
  });
  res.status(200).json({
    message: 'Deleted Menus',
  });
});

export default DeleteMenus;
