import { Router } from 'express';
import { requireAuth } from '../../middleware/require-auth.js';
import * as controller from './storage.controller.js';

export function createStorageRouter() {
  const router = Router();
  router.use(requireAuth);
  router.get('/', controller.list);
  router.post('/', controller.upload);
  router.get('/:fileId/download', controller.download);
  router.delete('/:fileId', controller.remove);
  return router;
}
