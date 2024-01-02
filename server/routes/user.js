const express = require('express');
const { fetchMonitors } = require('../database/queries');
const router = express.Router();

router.get('/monitors', async (request, response) => {
  const query = await fetchMonitors();
  return response.send(query);
});

module.exports = router;
