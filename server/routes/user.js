const express = require('express');
const cache = require('../cache');
const { setClientSideCookie } = require('../utils/cookies');
const {
  updateUserDisplayname,
  updateUserAvatar,
} = require('../database/queries/user');
const validators = require('../utils/validators');
const router = express.Router();

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

router.post('/update/username', async (request, response) => {
  const userCookie = request.cookies.user;

  if (!userCookie) {
    return response.sendStatus(401);
  }

  const {
    username,
    displayName: cookieDisplayName,
    avatar: cookieAvatar,
  } = JSON.parse(userCookie);
  const { displayName } = request.body;

  if (!displayName || cookieDisplayName === displayName) {
    return response.sendStatus(200);
  }

  const isValidUsername = validators.user.isUsername(username);

  if (isValidUsername) {
    return response.status(400).send(isValidUsername);
  }

  await updateUserDisplayname(username, displayName);

  setClientSideCookie(
    response,
    'user',
    JSON.stringify({
      ...JSON.parse(userCookie),
      displayName,
      avatar: cookieAvatar,
    })
  );

  return response.sendStatus(200);
});

router.post('/update/avatar', async (request, response) => {
  const userCookie = request.cookies.user;

  if (!userCookie) {
    return response.sendStatus(401);
  }

  const {
    username,
    avatar: cookieAvatar,
    displayName: cookieDisplayName,
  } = JSON.parse(userCookie);
  const { avatar } = request.body;

  if (!avatar || cookieAvatar === avatar) {
    return response.sendStatus(200);
  }

  const isValidAvatar = validators.user.isAvatar(avatar);

  if (isValidAvatar) {
    return response.status(400).send(isValidAvatar);
  }

  await updateUserAvatar(username, avatar);

  setClientSideCookie(
    response,
    'user',
    JSON.stringify({
      ...JSON.parse(userCookie),
      displayName: cookieDisplayName,
      avatar,
    })
  );

  return response.sendStatus(200);
});

module.exports = router;
