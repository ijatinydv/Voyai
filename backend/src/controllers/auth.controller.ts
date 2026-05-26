import { type Request, type Response, type NextFunction } from 'express';
import type { ApiResponse, AuthData } from '../types';
import { UserModel } from '../models/User.model.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../services/token.service.js';
import { ConflictError, NotFoundError, UnauthorizedError } from '../utils/AppError.js';
import { env } from '../config/env.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password, name } = req.body as { email: string; password: string; name: string };

    const existing = await UserModel.findOne({ email });
    if (existing) throw new ConflictError('An account with this email already exists');

    // passwordHash holds the plain value here; the pre-save hook hashes it before write
    const user = await UserModel.create({ email, passwordHash: password, name });

    const accessToken = generateAccessToken(String(user._id), user.email);
    const refreshToken = generateRefreshToken(String(user._id));

    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

    const response: ApiResponse<AuthData> = {
      success: true,
      data: { user: { id: String(user._id), email: user.email, name: user.name }, accessToken },
      message: 'Account created successfully',
      timestamp: new Date().toISOString(),
    };

    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const user = await UserModel.findOne({ email });
    // Use the same error message for both "not found" and "wrong password" to prevent user enumeration
    if (!user) throw new UnauthorizedError('Invalid email or password');

    const isValid = await user.comparePassword(password);
    if (!isValid) throw new UnauthorizedError('Invalid email or password');

    const accessToken = generateAccessToken(String(user._id), user.email);
    const refreshToken = generateRefreshToken(String(user._id));

    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

    const response: ApiResponse<AuthData> = {
      success: true,
      data: { user: { id: String(user._id), email: user.email, name: user.name }, accessToken },
      message: 'Login successful',
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = (req.cookies as Record<string, string | undefined>)['refreshToken'];
    if (!token) throw new UnauthorizedError('Refresh token not found');

    const payload = verifyRefreshToken(token);
    const user = await UserModel.findById(payload.sub);
    if (!user) throw new NotFoundError('User not found');

    const accessToken = generateAccessToken(String(user._id), user.email);

    const response: ApiResponse<{ accessToken: string }> = {
      success: true,
      data: { accessToken },
      message: 'Token refreshed',
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function logout(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.clearCookie('refreshToken', { httpOnly: true, secure: env.NODE_ENV === 'production', sameSite: 'strict' });

    const response: ApiResponse<null> = {
      success: true,
      data: null,
      message: 'Logged out successfully',
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new UnauthorizedError('Not authenticated');

    const response: ApiResponse<{ id: string; email: string }> = {
      success: true,
      data: req.user,
      message: 'User retrieved',
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
}
