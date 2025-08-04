import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
const prisma = new PrismaClient();

const GetCart = asyncHandler(async (req:Request,res:Response) => {
    const GetCart = await prisma.carts.findMany({
        where:{
            user_id: req.user?.id
        }
    })
})

module.exports = GetCart;