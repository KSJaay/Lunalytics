const express = require('express');
const cache = require('../cache');
const { updateUser } = require('../database/queries');
const { setClientSideCookie } = require('../utils/cookies');
const router = express.Router();

router.get('/monitors', async (request, response) => {
  const query = await cache.monitor.getMonitors();
  return response.send(query);
});

router.post('/update', async (request, response) => {
  const userCookie = request.cookies.user;

  if (!userCookie) {
    return response.sendStatus(401);
  }

  const {
    username,
    displayName: cookieDisplayName,
    avatar: cookieAvatar,
  } = JSON.parse(userCookie);

  const { displayName = cookieDisplayName, avatar = cookieAvatar } =
    request.body;

  await updateUser(username, displayName, avatar);

  setClientSideCookie(
    response,
    'user',
    JSON.stringify({ ...JSON.parse(userCookie), displayName, avatar })
  );

  return response.sendStatus(200);
});

module.exports = router;
