const { login } = require('../../controllers/user/loginRegisterUser');

import { Request, Response, NextFunction } from 'express';
jest.mock('../../prisma/client', () => ({
  users: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
}));
import prisma from '../../prisma/client';
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));
import bcrypt from 'bcrypt';
jest.mock('../../controllers/functions/jwt', () => ({
  AccessToken: jest.fn(),
  RefreshToken: jest.fn(),
}));
const {
  AccessToken,
  RefreshToken,
} = require('../../controllers/functions/jwt');
function mockReqBody(body: any = {}) {
  const req = { body } as unknown as Request;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    cookie: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
  } as unknown as Response;
  const next = jest.fn() as unknown as NextFunction;
  return { req, res, next };
}
describe('loginController (unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('perfect response 200 status', async () => {
    const email = 'user@example.com';
    const password = 'password123';
    const user = {
      id: 1,
      full_name: 'User',
      email,
      phone_number: '1234567890',
      password: 'hashed-password',
      role_id: 1,
      refreshToken: 'refreshToken' as string,
    };
    (prisma.users.findUnique as jest.Mock).mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (AccessToken as jest.Mock).mockReturnValue('accessToken' as string);
    (RefreshToken as jest.Mock).mockReturnValue('refreshToken' as string);
    (prisma.users.update as jest.Mock).mockResolvedValue(user);
    const { req, res, next } = mockReqBody({ email, password });
    await login(req, res, next);

    expect(prisma.users.findUnique).toHaveBeenCalledWith({
      where: { email },
    });
    expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
    expect(AccessToken).toHaveBeenCalledWith(user);
    expect(RefreshToken).toHaveBeenCalledWith(user);
    expect(prisma.users.update).toHaveBeenCalledWith({
      where: { id: user.id },
      data: { refreshToken: 'refreshToken' as string },
    });
    expect(res.cookie).toHaveBeenCalledWith('accesstoken', 'accessToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    });
    expect(res.cookie).toHaveBeenCalledWith('refreshtoken', 'refreshToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      name: user.full_name,
      role: user.role_id,
      message: 'Login successful',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
