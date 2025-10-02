import prisma from '../../prisma/client';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
const { AccessToken, RefreshToken } = require('../functions/jwt');
const { BetterError } = require('../../middleware/errorHandler');

function hashToken(rawToken: string) {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

const regUser = asyncHandler(async (req: Request, res: Response) => {
  const { full_name, email, phone_number, password, receivedToken } = req.body;
  console.log(
    'req.body',
    req.body,
    full_name,
    email,
    phone_number,
    password,
    receivedToken
  );
  if (!email || !password) {
    throw new BetterError(
      'Email and password are required',
      400,
      'BAD_REQUEST',
      'User Error'
    );
  }

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
    console.log('error');
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
          staffRoleId: invite.roleId,
          status: 'ACTIVE',
        },
      });
    }

    const role = await tx.staffRole.findUnique({
      where: { id: invite.roleId },
    });
    await tx.franchiseStaff.create({
      data: {
        staffId: staff.id,
        franchiseId: invite.franchiseId,
        position: role?.role,
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

const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, receivedToken } = req.body;

  if (!email || !password) {
    throw new BetterError(
      'Email and password are required',
      400,
      'BAD_REQUEST',
      'User Error'
    );
  }

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
          staffRoleId: invite.roleId,
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

    const role = await tx.staffRole.findUnique({
      where: { id: invite.roleId },
    });
    await tx.franchiseStaff.create({
      data: {
        staffId: staff.id,
        franchiseId: invite.franchiseId,
        position: role?.role,
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

module.exports = { regUser, login };
