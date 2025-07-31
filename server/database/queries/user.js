import SQLite from '../sqlite/setup.js';
import { generateHash, verifyPassword } from '../../utils/hashPassword.js';
import {
  AuthorizationError,
  ConflictError,
} from '../../../shared/utils/errors.js';
import { createUserSession } from './session.js';
import { oldPermsToFlags } from '../../../shared/permissions/oldPermsToFlags.js';

export const signInUser = async (email, password) => {
  const user = await SQLite.client('user').where({ email }).first();

  if (!user) {
    throw new AuthorizationError('User does not exist');
  }

  const passwordMatches = verifyPassword(password, user.password);

  if (!passwordMatches) {
    throw new AuthorizationError('Password does not match');
  }

  return user;
};

export const registerUser = async (data) => {
  const { email, password } = data;

  const userEmail = await SQLite.client('user').where({ email }).first();

  if (userEmail) {
    throw new ConflictError('Another user already exists with this email');
  }

  const hashedPassword = generateHash(password);

  data.password = hashedPassword;

  await SQLite.client('user').insert(data);

  return data;
};

export const getUserByEmail = async (email) => {
  return SQLite.client('user')
    .where({ email })
    .select(
      'email',
      'displayName',
      'avatar',
      'isVerified',
      'permission',
      'createdAt',
      'isOwner'
    )
    .first();
};

export const emailExists = async (email) => {
  return SQLite.client('user')
    .where({ email })
    .select(
      'email',
      'displayName',
      'avatar',
      'isVerified',
      'permission',
      'createdAt',
      'isOwner'
    )
    .first();
};

export const emailIsOwner = async (email) => {
  return SQLite.client('user').where({ email }).select('permission').first();
};

export const ownerExists = async () => {
  return SQLite.client('user')
    .where({ permission: oldPermsToFlags[1] })
    .select(
      'email',
      'displayName',
      'avatar',
      'isVerified',
      'permission',
      'createdAt',
      'isOwner'
    )
    .first();
};

export const getUserPasswordUsingEmail = async (email) => {
  const user = await SQLite.client('user').where({ email }).first();

  if (!user) {
    throw new AuthorizationError('User does not exist');
  }

  return user.password;
};

export const updateUserDisplayname = (email, displayName) => {
  return SQLite.client('user').where({ email }).update({ displayName });
};

export const updateUserAvatar = (email, avatar) => {
  return SQLite.client('user').where({ email }).update({ avatar });
};

export const fetchMembers = (userHasManageTeam = false) => {
  if (userHasManageTeam) {
    return SQLite.client('user').select(
      'email',
      'displayName',
      'avatar',
      'isVerified',
      'permission',
      'createdAt',
      'isOwner'
    );
  }

  return SQLite.client('user')
    .where({ isVerified: true })
    .select(
      'email',
      'displayName',
      'avatar',
      'isVerified',
      'permission',
      'createdAt',
      'isOwner'
    );
};

export const declineAccess = async (email) => {
  await SQLite.client('user_session').where({ email }).del();
  return SQLite.client('user').where({ email }).del();
};

export const approveAccess = (email) => {
  // check user using email and update isVerified to true

  const userExists = SQLite.client('user').where({ email }).first();

  if (!userExists) {
    throw new AuthorizationError('User does not exist');
  }

  return SQLite.client('user').where({ email }).update({ isVerified: true });
};

export const updateUserPermission = (email, permission) => {
  const userExists = SQLite.client('user').where({ email }).first();

  if (!userExists) {
    throw new AuthorizationError('User does not exist');
  }

  return SQLite.client('user').where({ email }).update({ permission });
};

export const updateUserPassword = (email, password) => {
  const hashedPassword = generateHash(password);

  return SQLite.client('user')
    .where({ email })
    .update({ password: hashedPassword });
};

export const resetDemoUser = async () => {
  const demoUser = await SQLite.client('user').where({ email: 'demo' }).first();

  if (demoUser) {
    await SQLite.client('user').where({ email: 'demo' }).update({
      email: 'demo',
      displayName: 'Demo User',
      password: 'demo',
      avatar: null,
      permission: oldPermsToFlags[4],
      isVerified: true,
    });
  }
};

export const getDemoUser = async () => {
  const demoUser = await SQLite.client('user').where({ email: 'demo' }).first();

  if (!demoUser) {
    await SQLite.client('user').insert({
      email: 'demo',
      displayName: 'Demo User',
      password: 'demo',
      avatar: null,
      permission: oldPermsToFlags[4],
      isVerified: true,
    });
  }

  return createUserSession('demo', 'demo', null);
};

export const transferOwnership = async (email, newOwner) => {
  await SQLite.client('user')
    .where({ email })
    .update({ permission: oldPermsToFlags[4], isOwner: false });

  return SQLite.client('user')
    .where({ email: newOwner })
    .update({ permission: oldPermsToFlags[1], isOwner: true });
};
