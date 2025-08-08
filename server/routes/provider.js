import express from 'express';
import { PermissionsBits } from '../../shared/permissions/bitFlags.js';
import deleteProviderMiddleware from '../middleware/provider/delete.js';
import createProviderMiddleware from '../middleware/provider/create.js';
import updateProviderMiddleware from '../middleware/provider/update.js';
import getAllProvidersMiddleware from '../middleware/provider/getAll.js';
import { hasRequiredPermission } from '../middleware/user/hasPermission.js';

const router = express.Router();

router.use(hasRequiredPermission(PermissionsBits.ADMINISTRATOR));

router.get('/', getAllProvidersMiddleware);
router.post('/create', createProviderMiddleware);
router.post('/update', updateProviderMiddleware);
router.post('/delete', deleteProviderMiddleware);

export default router;
