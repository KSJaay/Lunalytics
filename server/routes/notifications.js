import { Router } from 'express';
import NotificationCreateMiddleware from '../middleware/notifications/create.js';
import NotificationEditMiddleware from '../middleware/notifications/edit.js';
import NotificationGetAllMiddleware from '../middleware/notifications/getAll.js';
import NotificationGetUsingIdMiddleware from '../middleware/notifications/getUsingId.js';
import NotificationDeleteMiddleware from '../middleware/notifications/delete.js';
import NotificationToggleMiddleware from '../middleware/notifications/disable.js';
import hasEditorPermissions from '../middleware/user/hasEditor.js';

const router = Router();

router.get('/', hasEditorPermissions, NotificationGetAllMiddleware);
router.get('/id', hasEditorPermissions, NotificationGetUsingIdMiddleware);
router.post('/create', hasEditorPermissions, NotificationCreateMiddleware);
router.post('/edit', hasEditorPermissions, NotificationEditMiddleware);
router.get('/delete', hasEditorPermissions, NotificationDeleteMiddleware);
router.get('/toggle', hasEditorPermissions, NotificationToggleMiddleware);

export default router;
