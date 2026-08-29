import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User';
import jwt, { JwtPayload as JwtBasePayload } from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: IUser;
}

interface TokenPayload extends JwtBasePayload {
  userId: string;
  role: string;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({
        message: 'Not authorized, no token.',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        message: 'Not authorized, no token.',
      });
      return;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error('JWT_SECRET is not configured');
      res.status(500).json({
        message: 'Server configuration error.',
      });
      return;
    }

    const decoded = jwt.verify(token, secret);

    if (
      typeof decoded !== 'object' ||
      decoded === null ||
      !('userId' in decoded) ||
      typeof decoded.userId !== 'string'
    ) {
      res.status(401).json({
        message: 'Not authorized, invalid token.',
      });
      return;
    }

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      res.status(401).json({
        message: 'Not authorized, user not found.',
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Not authorized, token failed.',
    });
  }
};


export const admin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin.' });
  }
};