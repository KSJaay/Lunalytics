const SQLite = require('../sqlite/setup');

const fetchHeartbeats = async (monitorId) => {
  const heartbeats = await SQLite.client('heartbeat')
    .where({ monitorId })
    .select('id', 'status', 'latency', 'date', 'isDown', 'message')
    .orderBy('date', 'desc')
    .limit(168);

  return heartbeats;
};

const fetchHeartbeatsByDate = async (monitorId, date) => {
  const heartbeats = await SQLite.client('heartbeat')
    .where({ monitorId })
    .select('id', 'status', 'latency', 'date', 'isDown', 'message')
    .andWhere('date', '>', date)
    .orderBy('date', 'desc');

  return heartbeats;
};

const fetchLastDailyHeartbeat = async (monitorId) => {
  const currentDate = Date.now();
  const date = currentDate - (currentDate % 300000) - 300000;

  const heartbeats = await SQLite.client('heartbeat')
    .where({ monitorId, isDown: 0 })
    .andWhere('date', '>', date)
    .orderBy('date', 'desc');

  if (heartbeats.length === 0) {
    return {
      date: date,
      status: 'down',
      latency: 0,
    };
  }

  const averageLatency = Math.round(
    heartbeats.reduce((acc, curr) => acc + curr.latency, 0) / heartbeats.length
  );

  return {
    date: date,
    status: heartbeats[0].status,
    latency: averageLatency,
  };
};

const fetchDailyHeartbeats = async (monitorId) => {
  const date = Date.now() - 86400000;

  const heartbeats = await SQLite.client('heartbeat')
    .where({ monitorId, isDown: 0 })
    .andWhere('date', '>', date)
    .orderBy('date', 'desc');

  // get the first heartbeat of the day
  const firstHeartbeat = heartbeats[heartbeats.length - 1];
  let firstHeartbeatDate = firstHeartbeat.date;
  // next 5th minute
  let nextHeartbeat =
    firstHeartbeatDate - (firstHeartbeatDate % 300000) + 300000;
  const currentDate = Date.now();
  const lastFifthMinute = currentDate - (currentDate % 300000);

  const dailyHeartbeats = [];

  while (nextHeartbeat < lastFifthMinute) {
    const date = nextHeartbeat - 300000;
    const filteredHeartbeats = heartbeats.filter(
      (h) => h.date >= date && h.date < nextHeartbeat
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

const fetchHourlyHeartbeats = async (monitorId) => {
  const heartbeats = await SQLite.client('hourly_heartbeat')
    .where({ monitorId })
    .select('id', 'status', 'latency', 'date')
    .orderBy('date', 'desc')
    .limit(720);

  return heartbeats;
};

const createHourlyHeartbeat = async (data) => {
  const query = await SQLite.client('hourly_heartbeat').insert(data);

  return { id: query[0], ...data, monitorId: undefined };
};

const createHeartbeat = async (data) => {
  const date = Date.now();

  const query = await SQLite.client('heartbeat').insert({ date, ...data });

  return { id: query[0], date, ...data, monitorId: undefined };
};

const deleteHeartbeats = async (monitorId) => {
  await SQLite.client('heartbeat').where({ monitorId }).del();
};

module.exports = {
  fetchHeartbeats,
  fetchHeartbeatsByDate,
  fetchHourlyHeartbeats,
  fetchDailyHeartbeats,
  fetchLastDailyHeartbeat,
  createHeartbeat,
  createHourlyHeartbeat,
  deleteHeartbeats,
};
