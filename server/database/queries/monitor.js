import SQLite from '../sqlite/setup.js';
import randomId from '../../utils/randomId.js';
import { timeToMs } from '../../../shared/utils/ms.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';

const monitorExists = async (monitorId) => {
  return SQLite.client('monitor').where({ monitorId }).first();
};

const createMonitor = async (monitor) => {
  const monitorId = randomId();

  const createdAt = new Date().toISOString();

  // insert and return row
  const data = await SQLite.client('monitor')
    .insert({ ...monitor, createdAt, monitorId })
    .returning('*');

  return data[0];
};

const updateMonitor = async (monitor) => {
  await SQLite.client('monitor')
    .where({ monitorId: monitor.monitorId })
    .update(monitor);

  return monitor;
};

const fetchUptimePercentage = async (monitorId, duration = 24, type) => {
  const time = new Date(Date.now() - timeToMs(duration, type)).toISOString();

  const heartbeats = await SQLite.client('heartbeat')
    .select()
    .where('monitorId', monitorId)
    .andWhere('date', '>', time);

  const totalHeartbeats = heartbeats.length;
  const downHeartbeats = heartbeats.filter((h) => h.isDown).length;

  const averageHeartbeatLatency =
    Math.round(
      heartbeats.reduce((acc, curr) => acc + curr.latency, 0) / totalHeartbeats
    ) || 0;

  const uptimePercentage =
    Math.round(((totalHeartbeats - downHeartbeats) / totalHeartbeats) * 100) ||
    0;

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

    return !firstEverHeartbeat
      ? 0
      : new Date(firstEverHeartbeat.date).getTime();
  }

  const newestUptimeHeartbeat = await SQLite.client('heartbeat')
    .select()
    .where('monitorId', monitorId)
    .andWhere('isDown', false)
    .andWhere('date', '>', new Date(lastDownHeartbeat.date).toISOString())
    .orderBy('date', 'asc')
    .first();

  return !newestUptimeHeartbeat
    ? 0
    : new Date(newestUptimeHeartbeat.date).getTime();
};

const fetchMonitors = async () => {
  const mointors = await SQLite.client('monitor').select();

  const monitorWithHeartbeats = [];

  for (const monitor of mointors) {
    const uptime = await fetchUptimePercentage(monitor.monitorId);

    monitorWithHeartbeats.push({ ...monitor, ...uptime });
  }

  return monitorWithHeartbeats;
};

const fetchMonitor = async (monitorId) => {
  const monitor = await SQLite.client('monitor').where({ monitorId }).first();

  if (!monitor) {
    throw new UnprocessableError('Monitor does not exist');
  }

  const uptime = await fetchUptimePercentage(monitorId);

  return { ...monitor, ...uptime };
};

const deleteMonitor = async (monitorId) => {
  await SQLite.client('monitor').where({ monitorId }).del();

  return true;
};

const pauseMonitor = async (monitorId, paused) => {
  const monitor = await SQLite.client('monitor').where({ monitorId }).first();

  if (!monitor) {
    throw new UnprocessableError('Monitor does not exist');
  }

  await SQLite.client('monitor').where({ monitorId }).update({ paused });
};

const fetchUsingUrl = async (url) => {
  const monitor = await SQLite.client('monitor').where({ url }).first();

  if (!monitor) {
    throw new UnprocessableError('Monitor does not exist');
  }

  return monitor;
};

export {
  createMonitor,
  monitorExists,
  updateMonitor,
  fetchMonitors,
  fetchMonitor,
  deleteMonitor,
  fetchUptimePercentage,
  fetchMonitorUptime,
  pauseMonitor,
  fetchUsingUrl,
};
