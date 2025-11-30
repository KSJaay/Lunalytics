import express from 'express';
const router = express.Router();

import { PermissionsBits } from '../../shared/permissions/bitFlags.js';
import accessDeclineMiddleware from '../middleware/user/access/declineUser.js';
import accessApproveMiddleware from '../middleware/user/access/approveUser.js';
import accessRemoveMiddleware from '../middleware/user/access/removeUser.js';
import permissionUpdateMiddleware from '../middleware/user/permission/update.js';
import teamMembersListMiddleware from '../middleware/user/team/members.js';
import userUpdateAvatar from '../middleware/user/update/avatar.js';
import userUpdateUsername from '../middleware/user/update/username.js';
import userUpdatePassword from '../middleware/user/update/password.js';
import transferOwnershipMiddleware from '../middleware/user/transferOwnership.js';
import deleteAccountMiddleware from '../middleware/user/deleteAccount.js';
import userMonitorsMiddleware from '../middleware/user/monitors.js';
import userExistsMiddleware from '../middleware/user/exists.js';
import fetchUserMiddleware from '../middleware/user/user.js';
import { hasRequiredPermission } from '../middleware/user/hasPermission.js';
import deleteConnectionMiddleware from '../middleware/user/connections/delete.js';
import getAllConnectionMiddleware from '../middleware/user/connections/getAll.js';
import createConnectionMiddleware from '../middleware/user/connections/create.js';

router.get('/', fetchUserMiddleware);

router.post('/exists', userExistsMiddleware);

router.post('/delete/account', deleteAccountMiddleware);

router.get(
  '/monitors',
  hasRequiredPermission(PermissionsBits.VIEW_MONITORS),
  userMonitorsMiddleware
);

router.post('/update/username', userUpdateUsername);

router.post('/update/password', userUpdatePassword);

router.post('/update/avatar', userUpdateAvatar);

router.get('/team', teamMembersListMiddleware);

router.get('/connections', getAllConnectionMiddleware);

router.post('/connection/create', createConnectionMiddleware);

router.post('/connection/delete', deleteConnectionMiddleware);

router.use(hasRequiredPermission(PermissionsBits.MANAGE_TEAM));

router.post('/access/decline', accessDeclineMiddleware);

router.post('/access/approve', accessApproveMiddleware);

router.post('/access/remove', accessRemoveMiddleware);

router.use(hasRequiredPermission(PermissionsBits.ADMINISTRATOR));

router.post('/permission/update', permissionUpdateMiddleware);

router.post('/transfer/ownership', transferOwnershipMiddleware);

export default router;
