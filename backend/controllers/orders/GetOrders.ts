import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

const prisma = new PrismaClient();

const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const getOrders = await prisma.orders.findMany({
    where: {
      user_id: req.user?.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      createdAt: true,
      total_amount: true,
      discount_amount: true,
      delivery_charges: true,
      net_amount: true,
      payment_status: true,
      status: true,
      restaurants: {
        select: {
          name: true,
          imageurl: true,
        },
      },
      order_addresses: {
        select: {
          address: true,
          cities: {
            select: {
              city_name: true,
            },
          },
        },
      },
      order_items: {
        select: {
          product_name: true,
          price: true,
          quantity: true,
          menus: {
            select: {
              image_url: true,
            },
          },
          menu_variants: {
            select: {
              variety_name: true,
            },
          },
        },
      },
      order_payments: {
        select: {
          payment_mode: true,
          payment_status: true,
        },
      },
    },
  });
  const formattedOrders = getOrders.map((order) => ({
    orderId: order.id,
    placedAt: order.createdAt,
    status: order.status,
    amounts: {
      subtotal: order.total_amount,
      discount: order.discount_amount,
      delivery: order.delivery_charges,
      total: order.net_amount,
    },
    payment: {
      mode: order.order_payments[0]?.payment_mode || null,
      status: order.order_payments[0]?.payment_status || null,
    },
    restaurant: {
      name: order.restaurants?.name || '',
      image: order.restaurants?.imageurl || '',
    },
    deliveryAddress: {
      street: order.order_addresses?.address || '',
      city: order.order_addresses?.cities?.city_name || '',
    },
    items: order.order_items.map((item) => ({
      name: item.product_name,
      variant: item.menu_variants?.variety_name || '',
      price: item.price,
      quantity: item.quantity,
      image: item.menus?.image_url || '',
    })),
  }));

  res.status(200).json(formattedOrders);
});

module.exports = getOrders;
