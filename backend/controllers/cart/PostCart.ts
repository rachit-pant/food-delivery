import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
const prisma = new PrismaClient();


const PostCart = asyncHandler( async (req:Request,res:Response) => {
    const PostCart = await prisma.carts.create({
        data:{
            user_id: Number(req.user?.id),
            menu_id: Number(req.body.menu),
            variant_id: Number(req.body.variant),
            quantity: Number(req.body.quantity) || 1
        },
        select:{
            user_id: true,
            quantity: true
        }
    })
    res.status(200).json(PostCart);
})


module.exports = PostCart;