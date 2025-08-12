import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

const prisma = new PrismaClient();

const PostOrders = asyncHandler(async (req:Request,res:Response) => {
    const userId = req.user?.id;
    const cartItems = await prisma.carts.findMany({
        where:{
            user_id: userId
        }
    })
    if (!cartItems.length) {
    res.status(400).json({ message: 'Cart is empty' });
    return;
  }
  const newOrder = await prisma.orders.create({
    data:{
        user_id:userId,
        order_items:{
            create: cartItems.map(item => ({
                menu_id: item.menu_id,
                variant_id: item.variant_id,
                quantity: item.quantity,
            }))
        }
    },
    include:{
        order_items: true
    }
  })
  res.status(201).json({
    message: 'Order placed successfully',
    order: newOrder,
  });
})

module.exports = PostOrders;