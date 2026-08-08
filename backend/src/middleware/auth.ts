import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'change_me';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || typeof authHeader !== 'string') return res.status(401).json({ error: 'missing authorization header' });
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'invalid authorization header' });
    const token = parts[1];
    const payload: any = jwt.verify(token, JWT_SECRET);
    if (!payload || !payload.userId) return res.status(401).json({ error: 'invalid token' });
    const user = await prisma.user.findUnique({ where: { id: Number(payload.userId) } });
    if (!user) return res.status(401).json({ error: 'user not found' });
    req.user = { id: user.id, email: user.email, isAdmin: user.isAdmin };
    return next();
  } catch (e: any) {
    console.error('auth error', e.message || e);
    return res.status(401).json({ error: 'authentication failed' });
  }
}
