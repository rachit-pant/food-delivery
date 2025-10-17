import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import prisma from '../../prisma/client.js';
import { z } from 'zod';
import { BetterError } from '../../middleware/errorHandler.js';

const updateRole = asyncHandler(async (req: Request, res: Response) => {
  const schema = z.object({
    franchiseStaffId: z.coerce.number(),
    roleId: z.coerce.number(),
  });
  const validation = schema.safeParse(req.body);
  if (!validation.success) {
    throw new BetterError(
      'Missing required fields',
      400,
      'MISSING_REQUIRED_FIELDS',
      'Body Error'
    );
  }
  const { franchiseStaffId, roleId } = validation.data;
  const updatedRole = await prisma.franchiseStaff.update({
    where: { id: Number(franchiseStaffId) },
    data: { staffRoleId: Number(roleId) },
  });
  res.status(200).json(updatedRole);
});

export default updateRole;
