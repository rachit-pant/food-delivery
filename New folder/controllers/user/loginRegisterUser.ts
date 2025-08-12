import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const { AccessToken, RefreshToken } = require('../functions/jwt');
const prisma = new PrismaClient();
const regUser = asyncHandler(async (req: Request, res: Response) => {
  const { full_name, email, phone_number, password } = req.body;
  if (email === '' || password === '') {
    const err = new Error('enter correct details');
    (err as any).statusCode = 404;
    throw err;
  }
  const hash = await bcrypt.hash(password, 10);
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
  if (!user) {
    const err = new Error('server fault');
    (err as any).statusCode = 500;
    throw err;
  }
  res.json({
    id: user.role_id,
    name: user.full_name,
    email: user.email,
  });
});
const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const accessToken = AccessToken(user);
  const refreshToken = RefreshToken(user);

  await prisma.users.update({
    where: { id: user.id },
    data: { refreshToken },
  });

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
    message: 'Login successful',
  });
});

module.exports = { regUser, login };
