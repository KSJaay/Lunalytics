import database from '../connection.js';

export const fetchHeartbeats = async (
  monitorId: string,
  workspaceId: string,
  limit: number = 168
) => {
  const client = await database.connect();
  const heartbeats = await client?.('heartbeat')
    .where({ monitorId, workspaceId })
    .select('id', 'status', 'latency', 'date', 'isDown', 'message')
    .orderBy('date', 'desc')
    .limit(limit);

  return heartbeats;
};

export const fetchStatusChangeHeartbeats = async (
  monitorId: string,
  limit: number = 20
) => {
  const client = await database.connect();

  const rawQuery = `
    SELECT id, status, latency, date, isDown, message
    FROM (
      SELECT *, LAG(isDown) OVER (PARTITION BY monitorId ORDER BY date DESC) AS prevIsDown
      FROM (
        SELECT * FROM heartbeat
        WHERE monitorId = ?
        ORDER BY date DESC
        LIMIT 1000
      )
    )
    WHERE isDown != prevIsDown OR prevIsDown IS NULL
    ORDER BY date DESC
    LIMIT ?;
  `;
  const statusChanges = await client?.raw(rawQuery, [monitorId, limit]);

  return statusChanges;
};

export const isMonitorDown = async (
  monitorId: string,
  workspaceId: string,
  limit: number = 1
) => {
  const newLimit = limit || 1;
  const client = await database.connect();

  const heartbeats = await client?.('heartbeat')
    .where({ monitorId, workspaceId })
    .orderBy('date', 'desc')
    .limit(newLimit + 1);

  const oldestHeartbeat = heartbeats?.[heartbeats.length - 1];
  const limitHeartbeats = heartbeats?.slice(0, newLimit);
  const allDown = limitHeartbeats?.every((heartbeat) => heartbeat?.isDown);

  if (oldestHeartbeat?.isDown && allDown) {
    return false;
  }

  if (
    limitHeartbeats?.every((heartbeat) => heartbeat?.isDown) &&
    !oldestHeartbeat?.isDown
  ) {
    return limitHeartbeats[0];
  }

  return false;
};

export const isMonitorRecovered = async (
  monitorId: string,
  workspaceId: string,
  limit: number = 1
) => {
  const newLimit = limit + 1 || 1;
  const client = await database.connect();

  const query = await client?.('heartbeat')
    .where({ monitorId, workspaceId })
    .orderBy('date', 'desc')
    .limit(newLimit);

  if (query?.length === newLimit && !query[0]?.isDown) {
    const newestHeartbeat = query[0];
    const limitHeartbeats = query.slice(1, newLimit);

    return limitHeartbeats.every((heartbeat) => heartbeat.isDown)
      ? newestHeartbeat
      : false;
  }

  return false;
};

export const fetchHeartbeatsByDate = async (
  monitorId: string,
  workspaceId: string,
  date: string | number
) => {
  const isoDate = new Date(date).toISOString();
  const client = await database.connect();

  const heartbeats = await client?.('heartbeat')
    .where({ monitorId, workspaceId })
    .select('id', 'status', 'latency', 'date', 'isDown', 'message')
    .andWhere('date', '>', isoDate)
    .orderBy('date', 'desc');

  return heartbeats;
};

export const fetchDailyHeartbeats = async (
  monitorId: string,
  workspaceId: string
) => {
  const date = new Date(Date.now() - 86400000).toISOString();
  const client = await database.connect();

  console.log(monitorId, workspaceId, date);

  const heartbeats = await client?.('heartbeat')
    .where({ monitorId, workspaceId, isDown: false })
    .andWhere('date', '>', date)
    .orderBy('date', 'desc');

  const bucket: {
    [key: number]: {
      date: number;
      status: any;
      latency: number;
      count: number;
    };
  } = {};

  heartbeats?.forEach((heartbeat) => {
    const heartbeatDate = new Date(heartbeat.date).getTime();
    const nearestFifthMinute = heartbeatDate - (heartbeatDate % 300000);

    if (!bucket?.[nearestFifthMinute]) {
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
    const heartbeat = bucket[key as unknown as number];

    return {
      date: new Date(heartbeat.date).toISOString(),
      status: heartbeat.status,
      latency: Math.round(heartbeat.latency / heartbeat.count),
    };
  });
};

export const fetchHourlyHeartbeats = async (
  monitorId: string,
  workspaceId: string,
  limit: number = 720
) => {
  const client = await database.connect();

  const heartbeats = await client?.('hourly_heartbeat')
    .where({ monitorId, workspaceId })
    .select('id', 'status', 'latency', 'date')
    .orderBy('date', 'desc')
    .limit(limit);

  return heartbeats;
};

export const createHourlyHeartbeat = async (data: any) => {
  const client = await database.connect();

  const query = await client?.('hourly_heartbeat').insert(data);

  delete data.monitorId;

  return { id: query?.[0], ...data };
};

export const createHeartbeat = async (data: any) => {
  const date = new Date().toISOString();
  const client = await database.connect();

  const query = await client?.('heartbeat').insert({ date, ...data });

  delete data.monitorId;

  return { id: query?.[0], date, ...data };
};

export const deleteHeartbeats = async (
  monitorId: string,
  workspaceId: string
) => {
  const client = await database.connect();

  await client?.('heartbeat').where({ monitorId, workspaceId }).del();
};

export const cleanHeartbeats = async (date: string) => {
  const client = await database.connect();

  await client?.('heartbeat').andWhere('date', '<', date).del();
};
