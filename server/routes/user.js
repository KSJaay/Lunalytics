const express = require('express');
const { fetchMonitors } = require('../database/queries');
const cache = require('../cache');
const router = express.Router();

router.get('/monitors', async (request, response) => {
  const query = await cache.monitor.getMonitors();
  return response.send(query);
});

module.exports = router;
