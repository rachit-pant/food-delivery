import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
const prisma = new PrismaClient();


const GetMenus = asyncHandler(async (req:Request,res:Response) => {
    const restaurant_id = Number(req.params.id);
    const GetMenus= await prisma.menus.findMany({
        where:{
            restaurant_id
        }
    })
    if(!GetMenus){
        const error = new Error('no mennus found');
        (error as any).statusCode = 400;
        throw error;
    }
    res.status(200).json(GetMenus);
})

module.exports = GetMenus;