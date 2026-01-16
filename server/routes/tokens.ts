// import dependencies
import express from 'express';

// import local files
import { memberHasPermission } from '../middleware/hasPermission.js';
import { MemberPermissionBits } from '../../shared/permissions/bitFlags.js';
import createApiTokenMiddleware from '../middleware/tokens/create.js';
import updateApiTokenMiddleware from '../middleware/tokens/update.js';
import deleteApiTokenMiddleware from '../middleware/tokens/delete.js';

const router = express.Router();

router.use(memberHasPermission(MemberPermissionBits.ADMINISTRATOR));
router.post('/create', createApiTokenMiddleware);
router.post('/update', updateApiTokenMiddleware);
router.post('/delete', deleteApiTokenMiddleware);

export default router;
