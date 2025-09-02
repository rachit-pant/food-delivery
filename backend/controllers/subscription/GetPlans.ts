import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import prisma from '../../prisma/client';
const { BetterError } = require('../../middleware/errorHandler');
import groupBy from 'lodash/groupBy';
const GetPlans = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.user?.role);
  console.log(id);
  if (!id) {
    throw new BetterError('wrong id', 400, 'WRONG_ID', 'Error');
  }
  const plans = await prisma.plan.findMany({
    where: {
      role_id: id,
    },
  });
  if (plans.length === 0) {
    throw new BetterError('no plans found', 400, 'NO_PLANS_FOUND', 'Error');
  }
  res.status(200).json(plans);
});

module.exports = GetPlans;
