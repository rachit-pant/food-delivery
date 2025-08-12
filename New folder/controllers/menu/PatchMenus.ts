import { error } from 'console';
import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
const prisma = new PrismaClient();

const PatchMenus = asyncHandler( async (req:Request,res:Response) => {
    const MenuId = Number(req.params.menuId);
    const PatchMenus = await prisma.menus.update({
        where:{
            id:MenuId
        },
        data:{
            category_id: Number(req.body.category),
            item_name: req.body.item_name,
            description: req.body.description,
            image_url: req.body.photo,
            price: Number(req.body.price)
        }
    })
    if(!PatchMenus){
        const error = new Error('no menu found to be parched');
        (error as any).statusCode = 400;
        throw error;
    }
    res.status(200).json(PatchMenus);
})


module.exports = PatchMenus;