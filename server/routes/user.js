const express = require('express');
const router = express.Router();

const cache = require('../cache');
const hasAdminPermissions = require('../middleware/user/hasAdmin');
const accessDeclineMiddleware = require('../middleware/user/access/declineUser');
const accessApproveMiddleware = require('../middleware/user/access/approveUser');
const accessRemoveMiddleware = require('../middleware/user/access/removeUser');
const permissionUpdateMiddleware = require('../middleware/user/permission/update');
const teamMembersListMiddleware = require('../middleware/user/team/members');
const userUpdateAvatar = require('../middleware/user/update/avatar');
const userUpdateUsername = require('../middleware/user/update/username');
const { userExists } = require('../database/queries/user');

router.get('/', async (request, response) => {
  const { access_token } = request.cookies;
  const user = await userExists(access_token);

  const userInfo = {
    username: user.username,
    displayName: user.displayName,
    avatar: user.avatar,
    email: user.email,
    isVerified: user.isVerified,
    permission: user.permission,
  };

  userInfo.canEdit = [1, 2, 3].includes(user.permission);
  userInfo.canManage = [1, 2].includes(user.permission);

  return response.send(userInfo);
});

router.get('/monitors', async (request, response) => {
  const monitors = await cache.monitors.getAll();
  const query = [];

  for (const monitor of monitors) {
    const heartbeats = await cache.heartbeats.get(monitor.monitorId);
    const cert = await cache.certificates.get(monitor.monitorId);
    monitor.heartbeats = heartbeats;
    monitor.cert = cert;

    query.push(monitor);
  }

  return response.send(query);
});

router.post('/update/username', userUpdateUsername);

router.post('/update/avatar', userUpdateAvatar);

router.get('/team', teamMembersListMiddleware);

router.post('/access/decline', hasAdminPermissions, accessDeclineMiddleware);

router.post('/access/approve', hasAdminPermissions, accessApproveMiddleware);

router.post('/access/remove', hasAdminPermissions, accessRemoveMiddleware);

router.post('/permission/update', permissionUpdateMiddleware);

module.exports = router;
