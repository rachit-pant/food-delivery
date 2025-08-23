import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
const prisma = new PrismaClient();

const DeleteRestro = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.restaurantId);
  if (!id) {
    const error = new Error('no id exists');
    (error as any).statusCode = 400;
    throw error;
  }
  const DeleteRestro = await prisma.restaurants.delete({
    where: {
      id,
    },
  });
  if (!DeleteRestro) {
    const error = new Error('server error');
    (error as any).statusCode = 500;
    throw error;
  }
  res.status(200).json({
    message: `Deleted succesfully ${id}`,
  });
});

module.exports = DeleteRestro;
