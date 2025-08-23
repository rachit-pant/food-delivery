import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
const prisma = new PrismaClient();
const AddCategory = asyncHandler(async (req: Request, res: Response) => {
  const GetCategory = await prisma.menu_categories.findMany({});
  if (!GetCategory) {
    const error = new Error('server error');
    (error as any).statusCode = 500;
    throw error;
  }
  res.status(201).json(GetCategory);
});

module.exports = AddCategory;
