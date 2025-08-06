import { Request, Response, NextFunction } from 'express';
interface JwtPayload {
  id: number;
  role: number;
  email: string;
}
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
const authorizeRole = (...allowedRoles: number[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

module.exports = authorizeRole;
