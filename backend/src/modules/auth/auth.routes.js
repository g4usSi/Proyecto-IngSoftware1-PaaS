import { Router } from 'express';
import * as controller from './auth.controller.js';
import { requireAuth } from '../../middleware/require-auth.js';

export function createAuthRouter() {
  const router = Router();
  router.post('/register', controller.register);
  router.post('/login', controller.login);
  router.post('/verify-email', controller.verifyEmail);
  router.post('/forgot-password', controller.forgotPassword);
  router.post('/reset-password', controller.resetPassword);
  router.post('/logout', requireAuth, controller.logout);
  router.get('/me', requireAuth, controller.me);
  return router;
}
