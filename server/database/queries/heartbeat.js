import SQLite from '../sqlite/setup.js';

export const fetchHeartbeats = async (monitorId, limit = 168) => {
  const heartbeats = await SQLite.client('heartbeat')
    .where({ monitorId })
    .select('id', 'status', 'latency', 'date', 'isDown', 'message')
    .orderBy('date', 'desc')
    .limit(limit);

  return heartbeats;
};

export const fetchHeartbeatsByDate = async (monitorId, date) => {
  const isoDate = new Date(date).toISOString();

  const heartbeats = await SQLite.client('heartbeat')
    .where({ monitorId })
    .select('id', 'status', 'latency', 'date', 'isDown', 'message')
    .andWhere('date', '>', isoDate)
    .orderBy('date', 'desc');

  return heartbeats;
};

export const fetchDailyHeartbeats = async (monitorId) => {
  const date = new Date(Date.now() - 86400000).toISOString();

  const heartbeats = await SQLite.client('heartbeat')
    .where({ monitorId, isDown: false })
    .andWhere('date', '>', date)
    .orderBy('date', 'desc');

  // get the first heartbeat of the day
  const firstHeartbeat = heartbeats[heartbeats.length - 1] || {};
  let firstHeartbeatDate =
    new Date(firstHeartbeat.date).getTime() || Date.now();
  // next 5th minute
  let nextHeartbeat =
    firstHeartbeatDate - (firstHeartbeatDate % 300000) + 300000;
  const currentDate = Date.now();
  const lastFifthMinute = currentDate - (currentDate % 300000);

  const dailyHeartbeats = [];

  while (nextHeartbeat < lastFifthMinute) {
    const date = nextHeartbeat - 300000;
    const filteredHeartbeats = heartbeats.filter(
      (h) =>
        new Date(h.date).getTime() >= date &&
        new Date(h.date).getTime() < nextHeartbeat
    );

    if (filteredHeartbeats.length) {
      const averageLatency = Math.round(
        filteredHeartbeats.reduce((acc, curr) => acc + curr.latency, 0) /
          filteredHeartbeats.length
      );

      // Add the first heartbeat of the day
      dailyHeartbeats.unshift({
        date: nextHeartbeat - (nextHeartbeat % 300000),
        status: filteredHeartbeats[0].status,
        latency: averageLatency,
      });
    }

    nextHeartbeat += 300000;
  }

  return dailyHeartbeats;
};

export const fetchHourlyHeartbeats = async (monitorId, limit = 720) => {
  const heartbeats = await SQLite.client('hourly_heartbeat')
    .where({ monitorId })
    .select('id', 'status', 'latency', 'date')
    .orderBy('date', 'desc')
    .limit(limit);

  return heartbeats;
};

export const createHourlyHeartbeat = async (data) => {
  const query = await SQLite.client('hourly_heartbeat').insert(data);

  delete data.monitorId;

  return { id: query[0], ...data };
};

export const createHeartbeat = async (data) => {
  const date = new Date().toISOString();

  const query = await SQLite.client('heartbeat').insert({ date, ...data });

  delete data.monitorId;

  return { id: query[0], date, ...data };
};

export const deleteHeartbeats = async (monitorId) => {
  await SQLite.client('heartbeat').where({ monitorId }).del();
};

export const cleanHeartbeats = async (date) => {
  await SQLite.client('heartbeat').where('date', '<', date).del();
};
