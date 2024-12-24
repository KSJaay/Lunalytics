import express from 'express';
const router = express.Router();

import hasAdminPermissions from '../middleware/user/hasAdmin.js';
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

router.get('/', fetchUserMiddleware);

router.post('/exists', userExistsMiddleware);

router.get('/monitors', userMonitorsMiddleware);

router.post('/update/username', userUpdateUsername);

router.post('/update/password', userUpdatePassword);

router.post('/update/avatar', userUpdateAvatar);

router.get('/team', teamMembersListMiddleware);

router.post('/access/decline', hasAdminPermissions, accessDeclineMiddleware);

router.post('/access/approve', hasAdminPermissions, accessApproveMiddleware);

router.post('/access/remove', hasAdminPermissions, accessRemoveMiddleware);

router.post('/permission/update', permissionUpdateMiddleware);

router.post('/transfer/ownership', transferOwnershipMiddleware);

router.post('/delete/account', deleteAccountMiddleware);

export default router;
