import express from 'express';
const router = express.Router();

import cache from '../cache/index.js';
import hasAdminPermissions from '../middleware/user/hasAdmin.js';
import accessDeclineMiddleware from '../middleware/user/access/declineUser.js';
import accessApproveMiddleware from '../middleware/user/access/approveUser.js';
import accessRemoveMiddleware from '../middleware/user/access/removeUser.js';
import permissionUpdateMiddleware from '../middleware/user/permission/update.js';
import teamMembersListMiddleware from '../middleware/user/team/members.js';
import userUpdateAvatar from '../middleware/user/update/avatar.js';
import userUpdateUsername from '../middleware/user/update/username.js';
import { userExists, emailExists } from '../database/queries/user.js';
import { cleanMonitor } from '../class/monitor.js';
import userUpdatePassword from '../middleware/user/update/password.js';
import transferOwnershipMiddleware from '../middleware/user/transferOwnership.js';
import deleteAccountMiddleware from '../middleware/user/deleteAccount.js';
import { handleError } from '../../shared/utils/errors.js';

router.get('/', async (request, response) => {
  try {
    const { access_token } = request.cookies;

    const user = await userExists(access_token);

    const userInfo = {
      displayName: user.displayName,
      avatar: user.avatar,
      email: user.email,
      isVerified: user.isVerified,
      permission: user.permission,
    };

    userInfo.canEdit = [1, 2, 3].includes(user.permission);
    userInfo.canManage = [1, 2].includes(user.permission);

    return response.send(userInfo);
  } catch (error) {
    handleError(error, response);
  }
});

router.post('/exists', async (request, response) => {
  try {
    const { email } = request.body;
    if (!email) return response.status(400).send('No email provided');

    const user = await emailExists(email);
    if (!user) return response.send(false);

    return response.send(true);
  } catch (error) {
    handleError(error, response);
  }
});

router.get('/monitors', async (request, response) => {
  try {
    const monitors = await cache.monitors.getAll();
    const query = [];

    for (const monitor of monitors) {
      const heartbeats = await cache.heartbeats.get(monitor.monitorId);
      monitor.heartbeats = heartbeats;

      monitor.cert = { isValid: false };

      if (monitor.type === 'http') {
        const cert = await cache.certificates.get(monitor.monitorId);
        monitor.cert = cert;
      }

      query.push(cleanMonitor(monitor));
    }

    return response.send(query);
  } catch (error) {
    handleError(error, response);
  }
});

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
