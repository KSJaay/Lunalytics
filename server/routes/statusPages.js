import express from 'express';
import createStatusPageMiddleware from '../middleware/status/create.js';
import getUsingIdMiddleware from '../middleware/status/getUsingId.js';
import getAllStatusPagesMiddleware from '../middleware/status/getAll.js';
import editStatusPageMiddleware from '../middleware/status/edit.js';
import deleteStatusPageMiddleware from '../middleware/status/delete.js';
import { PermissionsBits } from '../../shared/permissions/bitFlags.js';
import { hasRequiredPermission } from '../middleware/hasPermission.js';

const router = express.Router();

router.use(hasRequiredPermission(PermissionsBits.VIEW_STATUS_PAGES));

router.get('/', getAllStatusPagesMiddleware);

router.get('/id', getUsingIdMiddleware);

router.use(hasRequiredPermission(PermissionsBits.MANAGE_STATUS_PAGES));

router.post('/create', createStatusPageMiddleware);

router.post('/update', editStatusPageMiddleware);

router.post('/delete', deleteStatusPageMiddleware);

export default router;
