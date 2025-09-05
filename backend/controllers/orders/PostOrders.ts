import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

const prisma = new PrismaClient();

const PostOrders = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const restaurant_id = req.body.restaurant_id;
  const ownerId = await prisma.restaurants.findUnique({
    where: {
      id: restaurant_id,
    },
  });
  let planId: { plan_id: number } | null = null;
  if (ownerId?.user_id) {
    planId = await prisma.sub.findFirst({
      where: {
        user_id: ownerId.user_id,
        isDefault: true,
      },
      select: {
        plan_id: true,
      },
    });
    console.log(planId);
  }

  const { payment } = req.body;
  const { addressId } = req.body;
  const paymentDetails = req.body.payment_status;
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
  let delivery_charges = 0;
  const subs = await prisma.sub.findMany({
    where: {
      user_id: userId,
      isDefault: true,
    },
    select: {
      plan_id: true,
    },
  });
  if (subs.length) {
    delivery_charges = 0;
  } else {
    delivery_charges = 50;
  }
  const newOrder = await prisma.orders.create({
    data: {
      user_id: userId,
      total_amount: req.body.amount,
      discount_amount: 0,
      delivery_charges: delivery_charges,
      tax_amount: 0,
      net_amount: req.body.amount + delivery_charges,
      payment_status: paymentDetails,
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
          payment_status: paymentDetails,
        },
      },
    },
    include: {
      order_items: true,
    },
  });
  const premiumPlans = [9, 12];
  const io = req.app.get('io');
  const onlineUsers = req.app.get('onlineUsers');
  const socketId: string[] | [] = onlineUsers.get(ownerId?.user_id) || [];
  if (planId && premiumPlans.includes(planId.plan_id)) {
    if (socketId.length > 0) {
      socketId.forEach((id) => {
        io.to(id).emit('newOrder', {
          orderId: newOrder.id,
          total: newOrder.net_amount,
          payments: newOrder.payment_status,
          items: newOrder.order_items,
          restaurant_name: ownerId?.name,
          restaurant_image: ownerId?.imageurl,
        });
      });
    }
  }

  await prisma.carts.deleteMany({ where: { user_id: userId } });
  res.status(201).json({
    message: 'Order placed successfully',
    order: newOrder,
  });
});

module.exports = PostOrders;
