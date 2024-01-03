const SQLite = require('./sqlite/setup');
const { generateHash, verifyPassword } = require('../utils/hashPassword');
const { signCookie, verifyCookie } = require('../utils/jwt');
const { AuthorizationError } = require('../utils/errors');
const randomId = require('../utils/randomId');
const { timeToMs } = require('../utils/ms');

const passwordMatches = (user, password) => {
  const passwordMatches = verifyPassword(password, user.password);

  if (!passwordMatches) {
    throw new AuthorizationError('Password does not match');
  }

  const username = user.username.toLowerCase();

  return {
    jwt: signCookie({ username }),
    user: { username, displayName: user.displayName, avatar: null },
  };
};

const signInUser = async (username, password, isInvalidEmail) => {
  if (isInvalidEmail) {
    const user = await SQLite.client('user')
      .where({ username: username.toLowerCase() })
      .first();

    if (!user) {
      throw new AuthorizationError('User does not exist');
    }

    return passwordMatches(user, password);
  }

  const user = await SQLite.client('user')
    .where({ email: username.toLowerCase() })
    .first();

  if (!user) {
    throw new AuthorizationError('User does not exist');
  }

  return passwordMatches(user, password);
};

const registerUser = async (email, username, password) => {
  const user = await SQLite.client('user')
    .where({ username: username.toLowerCase() })
    .first();
  const userEmail = await SQLite.client('user').where({ email }).first();

  if (user || userEmail) {
    throw new AuthorizationError(
      'Another user already exists with this email or usernmae'
    );
  }

  const hashedPassword = generateHash(password);

  await SQLite.client('user').insert({
    email: email.toLowerCase(),
    username: username.toLowerCase(),
    displayName: username,
    password: hashedPassword,
    avatar: null,
  });

  return {
    jwt: signCookie({ username: username.toLowerCase() }),
    user: {
      username: username.toLowerCase(),
      displayName: username,
      avatar: null,
    },
  };
};

const userExists = async (userToken) => {
  const user = verifyCookie(userToken);
  return SQLite.client('user').where({ username: user.username }).first();
};

const monitorExists = async (monitorId) => {
  return SQLite.client('monitor').where({ id: monitorId }).first();
};

const createMonitor = async (monitor) => {
  const monitorId = randomId();

  await SQLite.client('monitor').insert({ ...monitor, monitorId });

  return monitorId;
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
  const uptimePercentage =
    ((totalHeartbeats - downHeartbeats) / totalHeartbeats) * 100;
  return {
    uptimePercentage: uptimePercentage.toFixed(0),
    averageHeartbeatLatency,
  };
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

    monitorWithHeartbeats.push({
      ...monitor,
      heartbeats,
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

  const uptime = await fetchUptimePercentage(monitorId);

  return {
    ...monitor,
    heartbeats,
    ...uptime,
  };
};

const deleteMonitor = async (monitorId) => {
  await SQLite.client('monitor').where({ monitorId }).del();
  await SQLite.client('heartbeat').where({ monitorId }).del();

  return true;
};

const createHeartbeat = async (
  monitorId,
  status,
  latency,
  message,
  isDown = false
) => {
  const date = Date.now();

  const query = await SQLite.client('heartbeat').insert({
    monitorId,
    status,
    latency,
    message,
    isDown,
    date: Date.now(),
  });

  return {
    id: query[0],
    monitorId,
    status,
    latency,
    message,
    isDown,
    date,
  };
};

module.exports = {
  signInUser,
  registerUser,
  userExists,
  monitorExists,
  createMonitor,
  fetchMonitors,
  fetchMonitor,
  deleteMonitor,
  createHeartbeat,
  fetchUptimePercentage,
  fetchMonitorUptime,
};
