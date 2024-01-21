const SQLite = require('../sqlite/setup');
const randomId = require('../../utils/randomId');
const { timeToMs } = require('../../utils/ms');
const { fetchCertificate } = require('./certificate');

const monitorExists = async (monitorId) => {
  return SQLite.client('monitor').where({ id: monitorId }).first();
};

const createMonitor = async (monitor) => {
  const monitorId = randomId();

  await SQLite.client('monitor').insert({ ...monitor, monitorId });

  return monitorId;
};

const updateMonitor = async (monitor) => {
  await SQLite.client('monitor')
    .where({ monitorId: monitor.monitorId })
    .update(monitor);

  return true;
};

const fetchUptimePercentage = async (monitorId, duration = 24, type) => {
  const time = Date.now() - timeToMs(duration, type);

  const heartbeats = await SQLite.client('heartbeat')
    .select()
    .where('monitorId', monitorId)
    .andWhere('date', '>', time);

  const totalHeartbeats = heartbeats.length;
  const downHeartbeats = heartbeats.filter((h) => h.isDown).length;
  const averageHeartbeatLatency =
    heartbeats.reduce((acc, curr) => acc + curr.latency, 0) / totalHeartbeats;

  const uptimePercentage = (
    ((totalHeartbeats - downHeartbeats) / totalHeartbeats) *
    100
  ).toFixed(0);

  return { uptimePercentage, averageHeartbeatLatency };
};

const fetchMonitorUptime = async (monitorId) => {
  const lastDownHeartbeat = await SQLite.client('heartbeat')
    .select()
    .where('monitorId', monitorId)
    .andWhere('isDown', true)
    .orderBy('date', 'desc')
    .first();

  if (!lastDownHeartbeat) {
    const firstEverHeartbeat = await SQLite.client('heartbeat')
      .select()
      .where('monitorId', monitorId)
      .orderBy('date', 'asc')
      .first();

    return !firstEverHeartbeat ? 0 : firstEverHeartbeat.date;
  }

  const newestUptimeHeartbeat = await SQLite.client('heartbeat')
    .select()
    .where('monitorId', monitorId)
    .andWhere('isDown', false)
    .andWhere('date', '>', lastDownHeartbeat.date)
    .orderBy('date', 'asc')
    .first();

  return !newestUptimeHeartbeat ? 0 : newestUptimeHeartbeat.date;
};

const fetchMonitors = async () => {
  const mointors = await SQLite.client('monitor').select();

  const monitorWithHeartbeats = [];

  for (const monitor of mointors) {
    const heartbeats = await SQLite.client('heartbeat')
      .select()
      .where('monitorId', monitor.monitorId)
      .orderBy('date', 'desc')
      .limit(12);

    const uptime = await fetchUptimePercentage(monitor.monitorId);
    const cert = await fetchCertificate(monitor.monitorId);

    monitorWithHeartbeats.push({
      ...monitor,
      heartbeats,
      cert,
      ...uptime,
    });
  }

  return monitorWithHeartbeats;
};

const fetchMonitor = async (monitorId) => {
  const monitor = await SQLite.client('monitor').where({ monitorId }).first();

  if (!monitor) {
    throw new Error('Monitor does not exist');
  }

  const heartbeats = await SQLite.client('heartbeat')
    .where({ monitorId })
    .orderBy('date', 'desc')
    .limit(12);

  const cert = await fetchCertificate(monitor.monitorId);

  const uptime = await fetchUptimePercentage(monitorId);

  return {
    ...monitor,
    heartbeats,
    cert,
    ...uptime,
  };
};

const deleteMonitor = async (monitorId) => {
  await SQLite.client('monitor').where({ monitorId }).del();
  await SQLite.client('heartbeat').where({ monitorId }).del();
  await SQLite.client('certificate').where({ monitorId }).del();

  return true;
};

module.exports = {
  createMonitor,
  monitorExists,
  updateMonitor,
  fetchMonitors,
  fetchMonitor,
  deleteMonitor,
  fetchUptimePercentage,
  fetchMonitorUptime,
};
