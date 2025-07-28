import SQLite from '../sqlite/setup.js';

export const fetchHeartbeats = async (monitorId, limit = 168) => {
  const heartbeats = await SQLite.client('heartbeat')
    .where({ monitorId })
    .select('id', 'status', 'latency', 'date', 'isDown', 'message')
    .orderBy('date', 'desc')
    .limit(limit);

  return heartbeats;
};

export const isMonitorDown = async (monitorId, limit) => {
  const heartbeats = await SQLite.client('heartbeat')
    .where({ monitorId })
    .orderBy('date', 'desc')
    .limit(limit);

  return heartbeats.every((heartbeat) => heartbeat.isDown)
    ? heartbeats[heartbeats.length - 1]
    : false;
};

export const isMonitorRecovered = async (monitorId, limit) => {
  const newLimit = limit + 1;
  const query = SQLite.client('heartbeat')
    .where({ monitorId })
    .orderBy('date', 'desc')
    .limit(newLimit);

  if (query.length === newLimit && !query[query.length - 1].isDown) {
    const lastHeartbeat = query[query.length - 1];
    const limitHeartbeats = query.slice(0, limit);

    return limitHeartbeats.every((heartbeat) => heartbeat.isDown)
      ? lastHeartbeat
      : false;
  }

  return false;
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

  const bucket = {};

  heartbeats.forEach((heartbeat) => {
    const heartbeatDate = new Date(heartbeat.date).getTime();
    const nearestFifthMinute = heartbeatDate - (heartbeatDate % 300000);

    if (!bucket[nearestFifthMinute]) {
      bucket[nearestFifthMinute] = {
        date: nearestFifthMinute,
        status: heartbeat.status,
        latency: heartbeat.latency,
        count: 1,
      };
    }

    bucket[nearestFifthMinute].count++;
    bucket[nearestFifthMinute].latency =
      bucket[nearestFifthMinute].latency + heartbeat.latency;
  });

  return Object.keys(bucket).map((key) => {
    const heartbeat = bucket[key];

    return {
      date: new Date(heartbeat.date).toISOString(),
      status: heartbeat.status,
      latency: Math.round(heartbeat.latency / heartbeat.count),
    };
  });
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
