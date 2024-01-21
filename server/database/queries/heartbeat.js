const SQLite = require('../sqlite/setup');
const { fetchUptimePercentage } = require('./monitor');

const fetchHeartbeats = async (monitorId) => {
  const heartbeats = await SQLite.client('heartbeat')
    .where({ monitorId })
    .orderBy('date', 'desc')
    .limit(12);

  const uptime = await fetchUptimePercentage(monitorId);

  return { heartbeats, ...uptime };
};

const createHeartbeat = async (monitorId, status, latency, message, isDown) => {
  const date = Date.now();

  const data = { monitorId, status, latency, message, isDown, date };

  const query = await SQLite.client('heartbeat').insert(data);

  return { id: query[0], ...data };
};

module.exports = { fetchHeartbeats, createHeartbeat };
