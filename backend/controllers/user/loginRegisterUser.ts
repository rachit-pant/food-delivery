import { PrismaClient } from '../../generated/prisma';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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
    res.status(401); // Unauthorized
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role_id,
    },
    process.env.SECRET_KEY as string,
    { expiresIn: '1h' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600000, // 1 hour
  });

  res.status(200).json({
    id: user.id,
    name: user.full_name,
    email: user.email,
    role: user.role_id,
    message: 'Login successful',
  });
});

module.exports = { regUser, login };
