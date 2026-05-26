import { type Request, type Response, type NextFunction } from 'express';
import { verifyAccessToken } from '../services/token.service.js';
import { UnauthorizedError } from '../utils/AppError.js';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];

  if (!authHeader?.startsWith('Bearer ')) {
    next(new UnauthorizedError('Authorization header missing or malformed'));
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch (err) {
    next(err);
  }
}
