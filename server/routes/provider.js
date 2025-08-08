import express from 'express';
import { PermissionsBits } from '../../shared/permissions/bitFlags.js';
import deleteProviderMiddleware from '../middleware/provider/delete.js';
import configureProviderMiddleware from '../middleware/provider/configure.js';
import getAllProvidersMiddleware from '../middleware/provider/getAll.js';
import { hasRequiredPermission } from '../middleware/user/hasPermission.js';

const router = express.Router();

router.use(hasRequiredPermission(PermissionsBits.ADMINISTRATOR));

router.get('/', getAllProvidersMiddleware);
router.post('/configure', configureProviderMiddleware);
router.post('/delete', deleteProviderMiddleware);

export default router;
