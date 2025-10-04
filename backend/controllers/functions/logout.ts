import asyncHandler from 'express-async-handler';

import { Request, Response } from 'express';

const logout = asyncHandler(async (req: Request, res: Response) => {
  const settings = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  };
  res.clearCookie('accesstoken', settings);
  res.clearCookie('refreshtoken', settings);
  res.clearCookie('staffToken', settings);
  res.status(200).json({
    msessage: 'Logged out ',
  });
});

module.exports = logout;
