import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
const prisma = new PrismaClient();

const PatchCart = asyncHandler(async (req:Request,res:Response) => {
    const itemId = Number(req.params.itemId);
    const UpdateCart = await prisma.carts.updateMany({
        where:{
            user_id: req.user?.id,
            menu_id: itemId
        },
        data:{
            quantity: Number(req.body.quantity)
        }
    })
    if(UpdateCart.count === 0){
        const error = new Error('no item found');
        (error as any).statusCode = 400;
        throw error;
    }
    res.status(200).json({
        message: 'changed successfully'
    })
})

module.exports = PatchCart;