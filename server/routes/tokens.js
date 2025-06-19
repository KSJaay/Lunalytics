// import dependencies
import express from 'express';

// import local files
import { hasRequiredPermission } from '../middleware/user/hasPermission.js';
import { PermissionsBits } from '../../shared/permissions/bitFlags.js';
import getAllApiTokensMiddleware from '../middleware/tokens/getAll.js';
import createApiTokenMiddleware from '../middleware/tokens/create.js';
import updateApiTokenMiddleware from '../middleware/tokens/update.js';
import deleteApiTokenMiddleware from '../middleware/tokens/delete.js';

const router = express.Router();

const isAdmin = hasRequiredPermission(PermissionsBits.ADMINISTRATOR);

router.use(isAdmin);
router.get('/', getAllApiTokensMiddleware);
router.post('/create', createApiTokenMiddleware);
router.post('/update', updateApiTokenMiddleware);
router.post('/delete', deleteApiTokenMiddleware);

export default router;
