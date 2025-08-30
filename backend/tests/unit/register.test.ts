const { regUser } = require('../../controllers/user/loginRegisterUser');
import { NextFunction, Request, Response } from 'express';
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));
import bcrypt from 'bcrypt';
jest.mock('../../prisma/client', () => ({
  users: {
    create: jest.fn(),
  },
}));
import prisma from '../../prisma/client';

function mockReqBody(body: any = {}) {
  const req = { body } as unknown as Request;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;
  const next = jest.fn() as unknown as NextFunction;
  return { req, res, next };
}

describe('Register (Unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('Invalid Payload', async () => {
    const full_name = 'User Random';
    const email = '';
    const phone_number = '1234567890';
    const password = '';
    const { req, res, next } = mockReqBody({
      full_name,
      email,
      phone_number,
      password,
    });
    await regUser(req, res, next);
    expect(prisma.users.create).not.toHaveBeenCalled();
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: 'enter correct details',
        code: 'BAD_REQUEST',
        name: 'User Error',
      })
    );
  });
  it('Wrong Password', async () => {
    const full_name = 'User Random';
    const email = 'user@gmail.com';
    const phone_number = '1234567890';
    const password = '123456789';
    (bcrypt.hash as jest.Mock).mockRejectedValue(new Error('Hashing failed'));
    const { req, res, next } = mockReqBody({
      full_name,
      email,
      phone_number,
      password,
    });
    await regUser(req, res, next);
    expect(prisma.users.create).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: 'Wrong Password',
        code: 'Password',
        name: 'User Error',
      })
    );
  });
  it('Register status 409 email', async () => {
    const full_name = 'User Random';
    const email = 'user@gmail.com';
    const phone_number = '1234567890';
    const password = '123456789';
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    (prisma.users.create as jest.Mock).mockRejectedValue(
      Object.assign(new Error('Unique constraint failed'), {
        code: 'P2002',
        meta: { target: ['email'] },
      })
    );
    const { req, res, next } = mockReqBody({
      full_name,
      email,
      phone_number,
      password,
    });
    await regUser(req, res, next);
    expect(prisma.users.create).toHaveBeenCalledWith({
      data: {
        full_name,
        email,
        phone_number,
        password: 'hashed-password',
        role_id: 1,
      },
    });
    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 409,
        message: 'Email already exists',
        code: 'P2002',
        name: 'Prisma Error',
      })
    );
  });
  it('Register status 409 phone', async () => {
    const full_name = 'User Random';
    const email = 'user@gmail.com';
    const phone_number = '1234567890';
    const password = '123456789';
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    (prisma.users.create as jest.Mock).mockRejectedValue(
      Object.assign(new Error('Unique constraint failed'), {
        code: 'P2002',
        meta: { target: ['phone_number'] },
      })
    );
    const { req, res, next } = mockReqBody({
      full_name,
      email,
      phone_number,
      password,
    });
    await regUser(req, res, next);
    expect(prisma.users.create).toHaveBeenCalledWith({
      data: {
        full_name,
        email,
        phone_number,
        password: 'hashed-password',
        role_id: 1,
      },
    });
    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 409,
        message: 'Phone number already exists',
        code: 'P2002',
        name: 'Prisma Error',
      })
    );
  });
  it('Register status 409 duplicate', async () => {
    const full_name = 'User Random';
    const email = 'user@gmail.com';
    const phone_number = '1234567890';
    const password = '123456789';
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    (prisma.users.create as jest.Mock).mockRejectedValue(
      Object.assign(new Error('Unique constraint failed'), {
        code: 'P2002',
      })
    );
    const { req, res, next } = mockReqBody({
      full_name,
      email,
      phone_number,
      password,
    });
    await regUser(req, res, next);
    expect(prisma.users.create).toHaveBeenCalledWith({
      data: {
        full_name,
        email,
        phone_number,
        password: 'hashed-password',
        role_id: 1,
      },
    });
    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 409,
        message: 'Duplicate Value',
        code: 'P2002',
        name: 'Prisma Error',
      })
    );
  });
  it('Register OK status 200', async () => {
    const full_name = 'User Random';
    const email = 'user@gmail.com';
    const phone_number = '1234567890';
    const password = '123456789';
    const user = {
      id: 1,
      full_name,
      email,
      phone_number,
      password: 'hashed-password',
      role_id: 1,
      refreshToken: 'refreshToken' as string,
    };
    (prisma.users.create as jest.Mock).mockResolvedValue(user);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    const { req, res, next } = mockReqBody({
      full_name,
      email,
      phone_number,
      password,
    });
    await regUser(req, res, next);
    expect(prisma.users.create).toHaveBeenCalledWith({
      data: {
        full_name,
        email,
        phone_number,
        password: 'hashed-password',
        role_id: 1,
      },
    });
    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: user.role_id,
      name: user.full_name,
      email: user.email,
    });
    expect(next).not.toHaveBeenCalled();
  });
});
