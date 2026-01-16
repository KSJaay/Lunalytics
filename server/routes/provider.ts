import express from 'express';
import { MemberPermissionBits } from '../../shared/permissions/bitFlags.js';
import deleteProviderMiddleware from '../middleware/provider/delete.js';
import configureProviderMiddleware from '../middleware/provider/configure.js';
import getAllProvidersMiddleware from '../middleware/provider/getAll.js';
import { memberHasPermission } from '../middleware/hasPermission.js';

const router = express.Router();

router.use(memberHasPermission(MemberPermissionBits.ADMINISTRATOR));

router.get('/', getAllProvidersMiddleware);
router.post('/configure', configureProviderMiddleware);
router.post('/delete', deleteProviderMiddleware);

export default router;
