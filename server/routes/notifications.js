import { Router } from 'express';
import NotificationCreateMiddleware from '../middleware/notifications/create.js';
import NotificationEditMiddleware from '../middleware/notifications/edit.js';
import NotificationGetAllMiddleware from '../middleware/notifications/getAll.js';
import NotificationGetUsingIdMiddleware from '../middleware/notifications/getUsingId.js';
import NotificationDeleteMiddleware from '../middleware/notifications/delete.js';
import NotificationToggleMiddleware from '../middleware/notifications/disable.js';
import { hasRequiredPermission } from '../middleware/user/hasPermission.js';
import { PermissionsBits } from '../../shared/permissions/bitFlags.js';

const router = Router();

const hasEditorPermissions = hasRequiredPermission(
  PermissionsBits.MANAGE_NOTIFICATIONS
);

router.get('/', NotificationGetAllMiddleware);

router.use(hasEditorPermissions);
router.get('/id', NotificationGetUsingIdMiddleware);
router.post('/create', NotificationCreateMiddleware);
router.post('/edit', NotificationEditMiddleware);
router.get('/delete', NotificationDeleteMiddleware);
router.get('/toggle', NotificationToggleMiddleware);

export default router;
