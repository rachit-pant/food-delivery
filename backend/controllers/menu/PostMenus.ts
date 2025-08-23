import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
const prisma = new PrismaClient();
const MenusAdd = asyncHandler(async (req: Request, res: Response) => {
  const restaurantId = Number(req.params.restaurantId);
  const image = req.file?.filename;
  const variant = JSON.parse(req.body.variant);
  const { item_name, description } = req.body;
  const category_id = Number(req.body.category_id);
  console.log(category_id);
  const variety = variant.map((v: any) => ({
    variety_name: v.name,
    price: v.price,
  }));
  const MenusAdd = await prisma.menus.create({
    data: {
      restaurant_id: restaurantId,
      category_id: category_id,
      item_name: item_name,
      description: description,
      image_url: `/images/${image}`,
      price: 300,
    },
    select: {
      id: true,
      item_name: true,
    },
  });
  console.log(
    variety.map((v: any) => ({
      menu_id: MenusAdd.id,
      variety_name: v.variety_name,
      price: v.price,
    }))
  );
  await prisma.menu_variants.createMany({
    data: variety.map((v: any) => ({
      menu_id: MenusAdd.id,
      variety_name: v.variety_name,
      price: v.price,
    })),
  });
  if (!MenusAdd) {
    const error = new Error('no menus added');
    (error as any).statusCode = 400;
    throw error;
  }
  res.status(200).json({
    message: 'Menu added successfully',
    MenusAdd,
  });
});

module.exports = MenusAdd;
