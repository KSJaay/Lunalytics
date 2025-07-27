// import dependencies
import express from 'express';

// import local files
import { hasRequiredPermission } from '../middleware/user/hasPermission.js';
import { PermissionsBits } from '../../shared/permissions/bitFlags.js';
import getAllInvitesMiddleware from '../middleware/invites/getAll.js';
import createInviteMiddleware from '../middleware/invites/create.js';
import pauseInviteMiddleware from '../middleware/invites/pause.js';
import deleteInviteMiddleware from '../middleware/invites/delete.js';

const router = express.Router();

router.use(hasRequiredPermission(PermissionsBits.CREATE_INVITE));

router.get('/all', getAllInvitesMiddleware);
router.post('/create', createInviteMiddleware);
router.post('/pause', pauseInviteMiddleware);
router.post('/delete', deleteInviteMiddleware);

export default router;
