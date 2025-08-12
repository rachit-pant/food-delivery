import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
const prisma = new PrismaClient();

const DeleteCart = asyncHandler(async (req:Request,res:Response) => {
    const DeleteCart = await prisma.carts.deleteMany({
        where:{
            user_id: req.user?.id,
            menu_id: Number(req.params.itemId)
        }
    })
    if(!DeleteCart){
        const error = new Error('no user found');
        (error as any).statusCode = 400;
        throw error;
    }
    res.status(200).json({
        message: 'Deleted Succes'
    })
})

module.exports = DeleteCart;