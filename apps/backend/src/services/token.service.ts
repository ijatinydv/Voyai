import jwt, { type JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env.js';
import { UnauthorizedError } from '../utils/AppError.js';

interface AccessTokenPayload {
  sub: string;
  email: string;
}

interface RefreshTokenPayload {
  sub: string;
}

function isAccessTokenPayload(p: JwtPayload): p is AccessTokenPayload & JwtPayload {
  return typeof p['sub'] === 'string' && typeof p['email'] === 'string';
}

function isRefreshTokenPayload(p: JwtPayload): p is RefreshTokenPayload & JwtPayload {
  return typeof p['sub'] === 'string';
}

export function generateAccessToken(userId: string, email: string): string {
  return jwt.sign({ sub: userId, email }, env.JWT_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(userId: string): string {
  return jwt.sign({ sub: userId }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (typeof decoded === 'string' || !isAccessTokenPayload(decoded)) {
      throw new UnauthorizedError('Invalid token payload');
    }
    return { sub: decoded.sub, email: decoded.email };
  } catch (err) {
    if (err instanceof UnauthorizedError) throw err;
    throw new UnauthorizedError('Invalid or expired access token');
  }
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
    if (typeof decoded === 'string' || !isRefreshTokenPayload(decoded)) {
      throw new UnauthorizedError('Invalid token payload');
    }
    return { sub: decoded.sub };
  } catch (err) {
    if (err instanceof UnauthorizedError) throw err;
    throw new UnauthorizedError('Invalid or expired refresh token');
  }
}
