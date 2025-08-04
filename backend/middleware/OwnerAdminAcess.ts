import { PrismaClient } from '../generated/prisma';
import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
const prisma = new PrismaClient();
interface JwtPayload {
  id: number;
  role: number;
}
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
const DAR = asyncHandler(async (req:Request,res:Response,next:NextFunction) => {
    const ResId = Number(req.params.id)
    const ResData = await prisma.restaurants.findUnique({
        where:{
            id: ResId
        }
    })
    if (ResData?.user_id === req.user?.id || req.user?.role === 3){
        next();
    }else{
    const error = new Error('you dont have permission');
    (error as any).statusCode = 403;
    throw error;
    }
})


module.exports = DAR;