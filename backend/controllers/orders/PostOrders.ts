import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

const prisma = new PrismaClient();

const PostOrders = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const restaurant_id = req.body.restaurant_id;
  const { payment } = req.body;
  const { addressId } = req.body;
  const addressUser = await prisma.user_addresses.findUnique({
    where: {
      id: addressId,
    },
  });
  const cartItems = await prisma.carts.findMany({
    where: {
      user_id: userId,
    },
    include: {
      menu_variants: {
        select: {
          price: true,
        },
      },
      menus: {
        select: {
          item_name: true,
        },
      },
    },
  });
  if (!cartItems.length) {
    res.status(400).json({ message: 'Cart is empty' });
    return;
  }
  const newOrder = await prisma.orders.create({
    data: {
      user_id: userId,
      total_amount: req.body.amount,
      discount_amount: 100,
      delivery_charges: 100,
      tax_amount: 10,
      net_amount: req.body.amount + 100 - 100 + 10,
      payment_status: 'not_paid',
      status: 'preparing',
      restaurant_id,
      order_items: {
        create: cartItems.map((item) => ({
          menu_id: item.menu_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          price: item.menu_variants?.price,
          total_amount: (item.menu_variants?.price ?? 100) * item.quantity,
          product_name: item.menus?.item_name,
        })),
      },
      order_addresses: {
        create: {
          address_id: addressUser?.id,
          address: addressUser?.address,
          city_id: addressUser?.city_id,
        },
      },
      order_payments: {
        create: {
          amount: req.body.amount,
          payment_mode: payment || 'COD',
          payment_status: 'not_paid',
        },
      },
    },
    include: {
      order_items: true,
    },
  });
  await prisma.carts.deleteMany({ where: { user_id: userId } });
  res.status(201).json({
    message: 'Order placed successfully',
    order: newOrder,
  });
});

module.exports = PostOrders;
