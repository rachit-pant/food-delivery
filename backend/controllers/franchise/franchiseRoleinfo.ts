import crypto from 'node:crypto';
import type { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { z } from 'zod';
import { BetterError } from '../../middleware/errorHandler.js';
import prisma from '../../prisma/client.js';

const franchiseRoleinfo = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const schema = z.object({
      token: z.string(),
    });
    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      throw new BetterError(
        'Invalid token',
        400,
        'INVALID_TOKEN',
        'Token Error'
      );
    }
    const receivedToken = validation.data.token;
    const token = crypto
      .createHash('sha256')
      .update(receivedToken)
      .digest('hex');
    console.log(token);
    console.log(receivedToken);
    const invite = await prisma.staffInvite.findUnique({
      where: { token },
      select: {
        staffRole: {
          select: {
            id: true,
            role: true,
          },
        },
        franchise: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    res.status(200).json(invite);
  }
);

export default franchiseRoleinfo;
