import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
const { BetterError } = require('../middleware/errorHandler');
interface StaffPayload {
  id: number;
  role: string;
  franchiseId: number;
}

declare global {
  namespace Express {
    interface Request {
      staff?: StaffPayload;
    }
  }
}
const staffIdentifier = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.staffToken;
    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.REFRESH_SECRET_KEY as string
        ) as StaffPayload;

        req.staff = decoded;
        next();
      } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
          console.log('hello');
          throw new BetterError(
            'Token expired',
            401,
            'TOKEN_EXPIRED',
            'Token Error'
          );
        }
        throw new BetterError(
          'Invalid access token',
          401,
          'INVALID_ACCESS_TOKEN',
          'Token Error'
        );
      }
    } else {
      next();
    }
  }
);
module.exports = staffIdentifier;
