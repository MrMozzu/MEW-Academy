import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/helpers.js';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * JWT Authentication Middleware
 * Extracts and verifies JWT from Authorization header
 * Attaches decoded user to req.user
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required. Please sign in.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token. Please sign in again.' });
    return;
  }
}

/**
 * Optional Authentication Middleware
 * Same as authenticate but doesn't reject unauthenticated requests
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = verifyToken(token);
      req.user = decoded;
    } catch {
      // Token invalid, continue without user
    }
  }

  next();
}

/**
 * Role-based Authorization Middleware
 * Must be used after authenticate middleware
 */
export function authorize(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'You do not have permission to access this resource.' });
      return;
    }

    next();
  };
}
