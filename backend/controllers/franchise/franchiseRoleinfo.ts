import crypto from 'node:crypto';
import type { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';

import prisma from '../../prisma/client.js';

const franchiseRoleinfo = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const receivedToken = String(req.body.token);
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
