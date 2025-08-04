import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
interface JwtPayload {
  id: number;
  role: number;
}
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
const authorize = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const headerAuth = req.headers['authorization'];
    const token = headerAuth?.split(' ')[1];
    if (!token) {
      const error = new Error('no token provided');
      (error as any).statusCode = 401;
      throw error;
    }
    try {
      const data = jwt.verify(token, process.env.SECRET_KEY as string);
      req.user = data as JwtPayload;
      next();
    } catch (error) {
      const err = new Error('Invalid token');
      (err as any).statusCode = 401;
      throw err;
    }
  }
);

module.exports = authorize;
