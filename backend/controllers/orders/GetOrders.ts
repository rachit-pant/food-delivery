import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

const prisma = new PrismaClient();

const getOrders = asyncHandler(async (req:Request,res:Response) => {
    const getOrders = await prisma.orders.findMany({
        where:{
            user_id: req.user?.id
        },
        include:{
            order_items:{
                include:{
                    menus:true,
                    menu_variants:true
                }
            }
        }
    })
    res.status(200).json(getOrders);
})


module.exports = getOrders;