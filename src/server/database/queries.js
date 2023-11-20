const SQLite = require('./sqlite/setup');
const { generateHash, verifyPassword } = require('../utils/hashPassword');
const { signCookie } = require('../utils/jwt');
const { AuthorizationError } = require('../utils/errors');
const client = SQLite.client;

const passwordMatches = (user, password) => {
  const passwordMatches = verifyPassword(password, user.password);

  if (!passwordMatches) {
    throw new AuthorizationError('Password does not match');
  }

  return signCookie({
    email: user.email,
    username: user.username,
    displayName: user.displayName,
    avatar: user.avatar,
  });
};

const signInUser = async (username, password, isEmail) => {
  if (!isEmail) {
    const user = await client('user').where({ username }).first();

    if (!user) {
      throw new AuthorizationError('User does not exist');
    }

    return passwordMatches(user, password);
  }

  const user = await client('user').where({ email: username }).first();

  if (!user) {
    throw new AuthorizationError('User does not exist');
  }

  return passwordMatches(user, password);
};

module.exports = {
  signInUser,
};
