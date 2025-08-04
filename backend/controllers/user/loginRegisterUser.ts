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
      user_roles:{
        connect:{role_name: req.body.role}
      },
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
  const mail = req.body.email;
  const passWord = req.body.password;
  if (!mail || !passWord) {
    const err = new Error('no email entered');
    (err as any).statusCode = 400;
    throw err;
  }
  const user = await prisma.users.findUnique({
    where: {
      email: mail,
    },
  });
  if (user && (await bcrypt.compare(passWord, user.password))) {
    res.json({
      id: user.role_id,
      name: user.full_name,
      email: user.email,
      token: jwt.sign(
        {
          id: user.id,
          role: user.role_id,
        },
        process.env.SECRET_KEY as string,
        {
          expiresIn: '1h',
        }
      ),
    });
  } else {
    const err = new Error('invalid password');
    (err as any).statusCode = 400;
    throw err;
  }
});

module.exports = { regUser, login };
