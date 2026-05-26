import { Router } from 'express';
import { register, login, refreshToken, logout, getMe } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate, registerSchema, loginSchema } from '../utils/validate.js';

const router: Router = Router();

router.post('/register', validate(registerSchema, 'body'), register);
router.post('/login', validate(loginSchema, 'body'), login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);

export default router;
