const SQLite = require('./sqlite/setup');
const { generateHash, verifyPassword } = require('../utils/hashPassword');
const { signCookie, verifyCookie } = require('../utils/jwt');
const { AuthorizationError } = require('../utils/errors');
const randomId = require('../utils/randomId');

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

const createMonitor = async (
  user,
  name,
  url,
  interval,
  retryInterval,
  requestTimeout
) => {
  const monitorId = randomId();

  if (!user) {
    throw new AuthorizationError('User does not exist');
  }

  await SQLite.client('monitor').insert({
    monitorId,
    name,
    url,
    interval,
    retryInterval,
    requestTimeout,
    method: 'GET',
    username: user?.username,
  });

  return monitorId;
};

const fetchMonitors = async () => {
  const mointors = await SQLite.client('monitor').select();

  const monitorWithHeartbeats = [];

  for (const monitor of mointors) {
    const monitorHeartbeats = await SQLite.client('heartbeat')
      .select()
      .where('monitorId', monitor.monitorId)
      .orderBy('date', 'desc')
      .limit(12);

    const sortedHeartbeats = monitorHeartbeats.sort((a, b) => b.date - a.date);

    monitorWithHeartbeats.push({
      ...monitor,
      heartbeats: sortedHeartbeats,
    });
  }

  return monitorWithHeartbeats;
};

const createHeartbeat = (monitorId, status, latency, isDown = false) => {
  return SQLite.client('heartbeat').insert({
    monitorId,
    status,
    latency,
    isDown,
    date: Date.now(),
  });
};

module.exports = {
  signInUser,
  registerUser,
  userExists,
  monitorExists,
  createMonitor,
  fetchMonitors,
  createHeartbeat,
};
