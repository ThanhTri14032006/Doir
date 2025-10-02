import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/auth.controller';

const router = Router();

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('first_name').trim().notEmpty(),
    body('last_name').trim().notEmpty()
  ],
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  authController.login
);

router.post('/refresh', authController.refreshToken);

export default router;