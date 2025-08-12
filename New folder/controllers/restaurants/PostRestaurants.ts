import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
const prisma = new PrismaClient();

const AddResta = asyncHandler(async (req:Request,res:Response) => {
    const UserId = req.user?.id;
    const AddResta = await prisma.restaurants.create({
        data:{
            user_id: UserId,
            name: req.body.name,
            address: req.body.address,
            city_id: Number(req.body.city_id),
            rating: Number(req.body.rating) || 3,
            status: "active"
        },
        select:{
            user_id: true,
            name:true,
            rating:true,
            status:true
        }
    })
    if(!AddResta){
        const error = new Error('server error');
        (error as any).statusCode = 500;
        throw error;
    }
    res.status(200).json(AddResta);
})

module.exports = AddResta;