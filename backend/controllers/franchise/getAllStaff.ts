import prisma from '../../prisma/client';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
const { AccessToken, RefreshToken } = require('../functions/jwt');
const { BetterError } = require('../../middleware/errorHandler');

const getAllStaff = asyncHandler(async (req: Request, res: Response) => {
  const userId = Number(req.user?.id);
  if (!userId) {
    throw new BetterError(
      'Invalid Request',
      400,
      'INVALID_REQUEST',
      'Missing required fields'
    );
  }
  const staff = await prisma.franchiseStaff.findMany({
    where: {
      isActive: true,
      franchise: {
        userId: userId,
      },
    },
    include: {
      staff: true,
      staffRole: true,
      franchise: true,
    },
  });

  res.status(200).json(staff);
});
module.exports = getAllStaff;
