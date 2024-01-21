const SQLite = require('../sqlite/setup');

const fetchHeartbeats = async (monitorId) => {
  const heartbeats = await SQLite.client('heartbeat')
    .where({ monitorId })
    .orderBy('date', 'desc')
    .limit(12);

  return heartbeats;
};

const createHeartbeat = async (data) => {
  const date = Date.now();

  const query = await SQLite.client('heartbeat').insert({ date, ...data });

  return { id: query[0], date, ...data };
};

const deleteHeartbeats = async (monitorId) => {
  await SQLite.client('heartbeat').where({ monitorId }).del();
};

module.exports = { fetchHeartbeats, createHeartbeat, deleteHeartbeats };
