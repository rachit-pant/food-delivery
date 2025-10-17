import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { BetterError } from '../../middleware/errorHandler.js';
import prisma from '../../prisma/client.js';
import { AccessToken, RefreshToken } from '../functions/jwt.js';
import { z } from 'zod';
function hashToken(rawToken: string) {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

export const regUser = asyncHandler(async (req: Request, res: Response) => {
  const schema = z.object({
    full_name: z.string(),
    email: z.email(),
    phone_number: z.string(),
    password: z.string(),
    receivedToken: z.string(),
  });
  const validation = schema.safeParse(req.body);
  if (!validation.success) {
    throw new BetterError(
      'Invalid Request',
      400,
      'INVALID_REQUEST',
      'Missing required fields'
    );
  }
  const { full_name, email, phone_number, password, receivedToken } =
    validation.data;

  const hashedPassword = await bcrypt.hash(password, 10);
  const tokenHash = hashToken(receivedToken);

  const result = await prisma.$transaction(async (tx) => {
    const invite = await tx.staffInvite.findUnique({
      where: { token: tokenHash },
    });
    if (!invite) {
      throw new BetterError(
        'Invalid or missing invite',
        400,
        'INVALID_INVITE',
        'Invite Error'
      );
    }

    if (invite.expiresAt && invite.expiresAt < new Date()) {
      throw new BetterError(
        'Invite has expired',
        400,
        'EXPIRED_INVITE',
        'Invite Error'
      );
    }
    const user = await tx.users.create({
      data: {
        role_id: 4,
        full_name,
        email,
        phone_number,
        password: hashedPassword,
      },
    });

    await tx.staffInvite.update({
      where: { token: tokenHash },
      data: { status: 'ACCEPTED', acceptedAt: new Date() },
    });

    let staff = await tx.staff.findFirst({ where: { userId: user.id } });
    if (!staff) {
      staff = await tx.staff.create({
        data: {
          userId: user.id,
          fullName: user.full_name,
          status: 'ACTIVE',
        },
      });
    }

    await tx.franchiseStaff.create({
      data: {
        staffId: staff.id,
        franchiseId: invite.franchiseId,
        staffRoleId: invite.roleId,
        isActive: true,
      },
    });

    return user;
  });

  res.status(201).json({
    id: result.id,
    name: result.full_name,
    email: result.email,
    message: 'Staff account created successfully',
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const schema = z.object({
    email: z.email(),
    password: z.string(),
    receivedToken: z.string(),
  });
  const validation = schema.safeParse(req.body);
  if (!validation.success) {
    throw new BetterError(
      'Invalid Request',
      400,
      'INVALID_REQUEST',
      'Missing required fields'
    );
  }
  const { email, password, receivedToken } = validation.data;

  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) {
    throw new BetterError(
      'User not found',
      404,
      'USER_NOT_FOUND',
      'User Error'
    );
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new BetterError(
      'Invalid email or password',
      401,
      'BAD_CREDENTIALS',
      'User Error'
    );
  }

  const tokenHash = hashToken(receivedToken);

  await prisma.$transaction(async (tx) => {
    const invite = await tx.staffInvite.findUnique({
      where: { token: tokenHash },
    });
    if (!invite) {
      throw new BetterError(
        'Invalid or missing invite',
        400,
        'INVALID_INVITE',
        'Invite Error'
      );
    }

    if (invite.expiresAt && invite.expiresAt < new Date()) {
      throw new BetterError(
        'Invite has expired',
        400,
        'EXPIRED_INVITE',
        'Invite Error'
      );
    }

    await tx.staffInvite.update({
      where: { token: tokenHash },
      data: { status: 'ACCEPTED', acceptedAt: new Date() },
    });
    await tx.users.update({
      where: { id: user.id },
      data: { role_id: 4 },
    });

    let staff = await tx.staff.findFirst({ where: { userId: user.id } });
    if (!staff) {
      staff = await tx.staff.create({
        data: {
          userId: user.id,
          fullName: user.full_name,
          status: 'ACTIVE',
        },
      });
    }
    if (staff) {
      await tx.franchiseStaff.updateMany({
        where: { staffId: staff.id, franchiseId: invite.franchiseId },
        data: { isActive: false, endedAt: new Date() },
      });
    }

    await tx.franchiseStaff.create({
      data: {
        staffId: staff.id,
        franchiseId: invite.franchiseId,
        staffRoleId: invite.roleId,
        isActive: true,
      },
    });

    const refreshToken = RefreshToken(user);
    await tx.users.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    const accessToken = AccessToken(user);

    const cookieSettings = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
    };

    res.cookie('accesstoken', accessToken, cookieSettings);
    res.cookie('refreshtoken', refreshToken, cookieSettings);
    res.status(200).json({
      name: user.full_name,
      role: user.role_id,
      message: 'Login successful and staff invite accepted',
    });
  });
});
