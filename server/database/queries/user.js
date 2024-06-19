import SQLite from '../sqlite/setup.js';
import {
  generateHash,
  verifyPassword,
} from '../../../shared/utils/hashPassword.js';
import { signCookie, verifyCookie } from '../../../shared/utils/jwt.js';
import {
  AuthorizationError,
  ConflictError,
} from '../../../shared/utils/errors.js';

const passwordMatches = (user, password) => {
  const passwordMatches = verifyPassword(password, user.password);

  if (!passwordMatches) {
    throw new AuthorizationError('Password does not match');
  }

  const email = user.email.toLowerCase();

  return { jwt: signCookie({ email }), user };
};

const signInUser = async (email, password) => {
  const user = await SQLite.client('user').where({ email }).first();

  if (!user) {
    throw new AuthorizationError('User does not exist');
  }

  return passwordMatches(user, password);
};

const registerUser = async (data) => {
  const { email, password } = data;

  const userEmail = await SQLite.client('user').where({ email }).first();

  if (userEmail) {
    throw new ConflictError('Another user already exists with this email');
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

const emailExists = async (email) => {
  return SQLite.client('user').where({ email }).first();
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

const updateUserPassword = (email, password) => {
  const hashedPassword = generateHash(password);

  return SQLite.client('user')
    .where({ email })
    .update({ password: hashedPassword });
};

const getDemoUser = async () => {
  const demoUser = await SQLite.client('user').where({ email: 'demo' }).first();

  if (!demoUser) {
    await SQLite.client('user').insert({
      email: 'demo',
      displayName: 'Demo User',
      password: 'demo',
      avatar: null,
      permission: 4,
      isVerified: true,
    });
  }

  return signCookie({ email: 'demo' });
};

const transferOwnership = async (email, newOwner) => {
  await SQLite.client('user').where({ email }).update({ permission: 4 });
  return SQLite.client('user')
    .where({ email: newOwner })
    .update({ permission: 1 });
};

export {
  signInUser,
  registerUser,
  userExists,
  emailExists,
  updateUserDisplayname,
  updateUserAvatar,
  fetchMembers,
  declineAccess,
  approveAccess,
  updateUserPermission,
  updateUserPassword,
  getDemoUser,
  transferOwnership,
};
