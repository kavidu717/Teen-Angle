import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    role: string;
  };
}

interface DecodedToken extends JwtPayload {
  id: string;
  role: string;
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      message: 'Not authorized, no token',
    });
    return;
  }

  try {
    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        message: 'Not authorized, no token',
      });
      return;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, secret) as DecodedToken;

    req.user = {
      _id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    res.status(401).json({
      message: 'Not authorized, token failed',
    });
  }
};

export const admin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role === 'admin') {
    next();
    return;
  }

  res.status(403).json({
    message: 'Not authorized as an admin',
  });
};