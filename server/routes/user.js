import express from 'express';
const router = express.Router();

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
import { PermissionsBits } from '../../shared/permissions/bitFlags.js';

const hasManagePermissions = hasRequiredPermission(
  PermissionsBits.MANAGE_MONITORS
);
const hasAdminPermissions = hasRequiredPermission(
  PermissionsBits.ADMINISTRATOR
);

router.get('/', fetchUserMiddleware);

router.post('/exists', userExistsMiddleware);

router.get('/monitors', userMonitorsMiddleware);

router.post('/update/username', userUpdateUsername);

router.post('/update/password', userUpdatePassword);

router.post('/update/avatar', userUpdateAvatar);

router.get('/team', teamMembersListMiddleware);

router.use(hasManagePermissions);

router.post('/access/decline', accessDeclineMiddleware);

router.post('/access/approve', accessApproveMiddleware);

router.post('/access/remove', accessRemoveMiddleware);

router.use(hasAdminPermissions);

router.post('/permission/update', permissionUpdateMiddleware);

router.post('/transfer/ownership', transferOwnershipMiddleware);

router.post('/delete/account', deleteAccountMiddleware);

export default router;
