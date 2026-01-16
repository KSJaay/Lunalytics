import database from '../connection.js';
import randomId from '../../utils/randomId.js';
import { timeToMs } from '../../../shared/utils/ms.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';

const monitorExists = async (monitorId, workspaceId) => {
  const client = await database.connect();
  return client('monitor').where({ monitorId, workspaceId }).first();
};

const createMonitor = async (monitor) => {
  const monitorId = randomId();

  const created_at = new Date().toISOString();
  const client = await database.connect();

  // insert and return row
  const data = await client('monitor')
    .insert({ ...monitor, created_at, monitorId })
    .returning('*');

  return data[0];
};

const updateMonitor = async (monitor) => {
  const client = await database.connect();

  await client('monitor')
    .where({ monitorId: monitor.monitorId, workspaceId: monitor.workspaceId })
    .update(monitor);

  return monitor;
};

const fetchUptimePercentage = async (
  monitorId,
  workspaceId,
  duration = 24,
  type
) => {
  const time = new Date(Date.now() - timeToMs(duration, type)).toISOString();
  const client = await database.connect();

  const heartbeats = await client('heartbeat')
    .select()
    .where({ monitorId, workspaceId })
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

const fetchMonitorUptime = async (monitorId, workspaceId) => {
  const client = await database.connect();
  const lastDownHeartbeat = await client('heartbeat')
    .select()
    .where({ monitorId, workspaceId })
    .andWhere('isDown', true)
    .orderBy('date', 'desc')
    .first();

  if (!lastDownHeartbeat) {
    const firstEverHeartbeat = await client('heartbeat')
      .select()
      .where({ monitorId, workspaceId })
      .orderBy('date', 'asc')
      .first();

    return !firstEverHeartbeat
      ? 0
      : new Date(firstEverHeartbeat.date).getTime();
  }

  const newestUptimeHeartbeat = await client('heartbeat')
    .select()
    .where({ monitorId, workspaceId })
    .andWhere('isDown', false)
    .andWhere('date', '>', new Date(lastDownHeartbeat.date).toISOString())
    .orderBy('date', 'asc')
    .first();

  return !newestUptimeHeartbeat
    ? 0
    : new Date(newestUptimeHeartbeat.date).getTime();
};

const fetchAllMonitors = async () => {
  const client = await database.connect();
  const mointors = await client('monitor').select();

  const monitorWithHeartbeats = [];

  for (const monitor of mointors) {
    const uptime = await fetchUptimePercentage(
      monitor.monitorId,
      monitor.workspaceId
    );

    monitorWithHeartbeats.push({ ...monitor, ...uptime });
  }

  return monitorWithHeartbeats;
};

const fetchMonitors = async (workspaceId) => {
  const client = await database.connect();
  const mointors = await client('monitor').where({ workspaceId }).select();

  const monitorWithHeartbeats = [];

  for (const monitor of mointors) {
    const uptime = await fetchUptimePercentage(
      monitor.monitorId,
      monitor.workspaceId
    );

    monitorWithHeartbeats.push({ ...monitor, ...uptime });
  }

  return monitorWithHeartbeats;
};

const fetchMonitor = async (monitorId, workspaceId) => {
  const client = await database.connect();
  const monitor = await client('monitor')
    .where({ monitorId, workspaceId })
    .first();

  if (!monitor) {
    throw new UnprocessableError('Monitor does not exist');
  }

  const uptime = await fetchUptimePercentage(monitorId, workspaceId);

  return { ...monitor, ...uptime };
};

const deleteMonitor = async (monitorId, workspaceId) => {
  const client = await database.connect();
  await client('monitor').where({ monitorId, workspaceId }).del();

  return true;
};

const pauseMonitor = async (monitorId, workspaceId, paused) => {
  const client = await database.connect();
  const monitor = await client('monitor')
    .where({ monitorId, workspaceId })
    .first();

  if (!monitor) {
    throw new UnprocessableError('Monitor does not exist');
  }

  await client('monitor').where({ monitorId, workspaceId }).update({ paused });
};

const fetchUsingToken = async (token) => {
  const client = await database.connect();
  const monitor = await client('monitor').where({ url: token }).first();

  if (!monitor) {
    throw new UnprocessableError('Monitor does not exist');
  }

  return monitor;
};

export {
  createMonitor,
  monitorExists,
  updateMonitor,
  fetchAllMonitors,
  fetchMonitors,
  fetchMonitor,
  deleteMonitor,
  fetchUptimePercentage,
  fetchMonitorUptime,
  pauseMonitor,
  fetchUsingToken,
};
