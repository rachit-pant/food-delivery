import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
const prisma = new PrismaClient();
const MenusAdd = asyncHandler(async (req:Request,res:Response) => {
    const MenusAdd = await prisma.menus.create({
        data:{
            restaurant_id: Number(req.params.id),
            category_id: Number(req.body.category),
            item_name: req.body.item_name,
            description: req.body.description,
            image_url: req.body.photo,
            price: Number(req.body.price)
        },
        select:{
            restaurant_id:true,
            category_id:true,
            item_name:true,
            price:true
        }
    })
    if(!MenusAdd){
        const error = new Error('no menus added');
        (error as any).statusCode = 400;
        throw error;
    }
    res.status(200).json(MenusAdd);
})

module.exports = MenusAdd;