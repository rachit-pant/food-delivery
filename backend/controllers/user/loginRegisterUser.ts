import prisma from '../../prisma/client';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const { AccessToken, RefreshToken } = require('../functions/jwt');
const { BetterError } = require('../../middleware/errorHandler');

const regUser = asyncHandler(async (req: Request, res: Response) => {
  const { full_name, email, phone_number, password } = req.body;
  if (email === '' || password === '') {
    throw new BetterError(
      'enter correct details',
      400,
      'BAD_REQUEST',
      'User Error'
    );
  }
  let hash: string;
  try {
    hash = await bcrypt.hash(password, 10);
  } catch (err) {
    throw new BetterError('Wrong Password', 500, 'Password', 'User Error');
  }
  try {
    const user = await prisma.users.create({
      data: {
        role_id: 1,
        // user_roles: {
        //   connect: { role_name: req.body.role },
        // },
        full_name,
        email,
        phone_number,
        password: hash,
      },
    });
    res.status(201).json({
      id: user.role_id,
      name: user.full_name,
      email: user.email,
    });
  } catch (err: any) {
    if (err.code === 'P2002') {
      if (err.meta?.target[0] === 'email') {
        throw new BetterError(
          'Email already exists',
          409,
          'P2002',
          'Prisma Error'
        );
      } else if (err.meta?.target[0] === 'phone_number') {
        throw new BetterError(
          'Phone number already exists',
          409,
          'P2002',
          'Prisma Error'
        );
      } else {
        throw new BetterError('Duplicate Value', 409, 'P2002', 'Prisma Error');
      }
    }
    throw err;
  }
});
const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BetterError(
      'Email and password are required',
      400,
      'BAD_REQUEST',
      'User Error'
    );
  }
  let user: any;
  try {
    user = await prisma.users.findUnique({
      where: { email },
    });
  } catch (err) {
    throw new BetterError(
      'User not found',
      404,
      'USER_NOT_FOUND',
      'User Error'
    );
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw new BetterError(
      'Invalid email or password',
      401,
      'BAD_REQUEST',
      'User Error'
    );
  }

  const accessToken = AccessToken(user);
  const refreshToken = RefreshToken(user);
  const cookieSettings = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  };
  try {
    await prisma.users.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.cookie('accesstoken', accessToken, cookieSettings);
    res.cookie('refreshtoken', refreshToken, cookieSettings);
    res.status(200).json({
      name: user.full_name,
      role: user.role_id,
      message: 'Login successful',
    });
  } catch (err) {
    throw new BetterError(
      'User not updated',
      404,
      'USER_NOT_UPDATED',
      'User Error'
    );
  }
});

module.exports = { regUser, login };
