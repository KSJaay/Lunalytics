const SQLite = require('../sqlite/setup');
const { generateHash, verifyPassword } = require('../../utils/hashPassword');
const { signCookie, verifyCookie } = require('../../utils/jwt');
const { AuthorizationError } = require('../../utils/errors');

const passwordMatches = (user, password) => {
  const passwordMatches = verifyPassword(password, user.password);

  if (!passwordMatches) {
    throw new AuthorizationError('Password does not match');
  }

  const email = user.email.toLowerCase();

  return signCookie({ email });
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

const registerUser = async (data) => {
  const { email, username, password } = data;

  const user = await SQLite.client('user').where({ username }).first();
  const userEmail = await SQLite.client('user').where({ email }).first();

  if (user || userEmail) {
    throw new AuthorizationError(
      'Another user already exists with this email or usernmae'
    );
  }

  const hashedPassword = generateHash(password);

  data.password = hashedPassword;

  await SQLite.client('user').insert(data);

  return signCookie({ email });
};

const userExists = async (access_token) => {
  const user = verifyCookie(access_token);
  return SQLite.client('user').where({ email: user.email }).first();
};

const updateUserDisplayname = (email, displayName) => {
  return SQLite.client('user').where({ email }).update({ displayName });
};

const updateUserAvatar = (email, avatar) => {
  return SQLite.client('user').where({ email }).update({ avatar });
};

const fetchMembers = () => {
  return SQLite.client('user').select(
    'email',
    'username',
    'displayName',
    'avatar',
    'isVerified',
    'permission',
    'createdAt'
  );
};

const declineAccess = (email) => {
  return SQLite.client('user').where({ email }).del();
};

const approveAccess = (email) => {
  // check user using email and update isVerified to true

  const userExists = SQLite.client('user').where({ email }).first();

  if (!userExists) {
    throw new AuthorizationError('User does not exist');
  }

  return SQLite.client('user').where({ email }).update({ isVerified: true });
};

const updateUserPermission = (email, permission) => {
  const userExists = SQLite.client('user').where({ email }).first();

  if (!userExists) {
    throw new AuthorizationError('User does not exist');
  }

  return SQLite.client('user').where({ email }).update({ permission });
};

module.exports = {
  signInUser,
  registerUser,
  userExists,
  updateUserDisplayname,
  updateUserAvatar,
  fetchMembers,
  declineAccess,
  approveAccess,
  updateUserPermission,
};
