import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

const prisma = new PrismaClient();

const DeleteOrder = asyncHandler(async (req:Request,res:Response) => {
    const orderId = Number(req.params.orderId)
    const DeleteOrder = await prisma.orders.deleteMany({
        where:{
            user_id: req.user?.id,
            id: orderId
        }
    })
    res.status(200).json({
        message: 'deleted'
    })
})


module.exports = DeleteOrder