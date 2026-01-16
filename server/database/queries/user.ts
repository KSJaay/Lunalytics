import database from '../connection.js';
import { generateHash, verifyPassword } from '../../utils/hashPassword.js';
import {
  AuthorizationError,
  ConflictError,
} from '../../../shared/utils/errors.js';
import { createUserSession } from './session.js';
import { oldPermsToFlags } from '../../../shared/permissions/oldPermsToFlags.js';

export const signInUser = async (email, password) => {
  const client = await database.connect();
  const user = await client('user').where({ email }).first();

  if (!user) {
    throw new AuthorizationError('User does not exist');
  }

  if (user.sso) {
    throw new AuthorizationError('User is signed in with SSO');
  }

  const passwordMatches = verifyPassword(password, user.password);

  if (!passwordMatches) {
    throw new AuthorizationError('Password does not match');
  }

  return user;
};

export const registerUser = async (data) => {
  const { email, password } = data;

  const client = await database.connect();
  const userEmail = await client('user').where({ email }).first();

  if (userEmail) {
    throw new ConflictError('Another user already exists with this email');
  }

  const hashedPassword = generateHash(password);

  const user = {
    email: email.toLowerCase(),
    displayName: data.displayName,
    password: hashedPassword,
    avatar: data.avatar,
    isVerified: data.isVerified || false,
  };

  await client('user').insert(user);
  return user;
};

export const registerSsoUser = async (data) => {
  const {
    avatar,
    displayName,
    email,
    id,
    provider,
    sso,
    isVerified = false,
  } = data;

  const created_at = new Date().toISOString();

  const client = await database.connect();

  await client('user').insert({
    email,
    displayName,
    avatar,
    sso,
    created_at,
    isVerified,
    password: null,
  });

  await client('connections').insert({
    accountId: id,
    email,
    provider,
    created_at,
  });

  return data;
};

export const getUserByEmail = async (email) => {
  const client = await database.connect();
  let user = await client('user')
    .where({ email })
    .select(
      'email',
      'displayName',
      'avatar',
      'isVerified',
      'created_at',
      'sso',
      'settings'
    )
    .first();

  if (user && user.settings) {
    try {
      user.settings = JSON.parse(user.settings);
    } catch {
      user.settings = {};
    }
  }

  return user;
};

export const emailIsOwner = async (email) => {
  const client = await database.connect();

  return client('user').where({ email }).select('isOwner').first();
};

export const ownerExists = async () => {
  const client = await database.connect();

  let user = await client('user')
    .select('email', 'displayName', 'avatar', 'isVerified', 'sso', 'settings')
    .first();

  if (user && user.settings) {
    try {
      user.settings = JSON.parse(user.settings);
    } catch {
      user.settings = {};
    }
  }

  return user;
};

export const getUserPasswordUsingEmail = async (email) => {
  const client = await database.connect();
  const user = await client('user').where({ email }).first();

  if (!user) {
    throw new AuthorizationError('User does not exist');
  }

  return user.password;
};

export const updateUserDisplayname = async (email, displayName) => {
  const client = await database.connect();
  return client('user').where({ email }).update({ displayName });
};

export const updateUserAvatar = async (email, avatar) => {
  const client = await database.connect();
  return client('user').where({ email }).update({ avatar });
};

export const fetchMembers = async (userHasManageTeam = false) => {
  const client = await database.connect();

  if (userHasManageTeam) {
    return client('user').select(
      'email',
      'displayName',
      'avatar',
      'isVerified',
      'created_at',
      'sso'
    );
  }

  return client('user')
    .where({ isVerified: true })
    .select(
      'email',
      'displayName',
      'avatar',
      'isVerified',
      'created_at',
      'sso'
    );
};

export const declineAccess = async (email) => {
  const client = await database.connect();

  await client('user_session').where({ email }).del();

  return client('user').where({ email }).del();
};

export const approveAccess = async (email) => {
  // check user using email and update isVerified to true

  const client = await database.connect();
  const userExists = await client('user').where({ email }).first();

  if (!userExists) {
    throw new AuthorizationError('User does not exist');
  }

  return client('user').where({ email }).update({ isVerified: true });
};

export const updateUserPermission = async (email, permission) => {
  const client = await database.connect();
  const userExists = await client('user').where({ email }).first();

  if (!userExists) {
    throw new AuthorizationError('User does not exist');
  }

  return client('user').where({ email }).update({ permission });
};

export const updateUserPassword = async (email, password) => {
  const client = await database.connect();
  const hashedPassword = generateHash(password);

  return client('user').where({ email }).update({ password: hashedPassword });
};

export const updateUserSettings = async (email, settings) => {
  const client = await database.connect();
  return client('user')
    .where({ email })
    .update({ settings: JSON.stringify(settings) });
};

export const resetDemoUser = async () => {
  const client = await database.connect();
  const demoUser = await client('user').where({ email: 'demo' }).first();

  if (demoUser) {
    await client('user').where({ email: 'demo' }).update({
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
  const client = await database.connect();
  const demoUser = await client('user').where({ email: 'demo' }).first();

  if (!demoUser) {
    await client('user').insert({
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
  const client = await database.connect();
  await client('user')
    .where({ email })
    .update({ permission: oldPermsToFlags[4] });

  return client('user')
    .where({ email: newOwner })
    .update({ permission: oldPermsToFlags[1] });
};

export const fetchUserWorkspaces = async (email) => {
  const client = await database.connect();
  const memberWorkspaces = await client('member')
    .where({ email })
    .select('workspaceId');

  const workspaceIds = memberWorkspaces.map((mw) => mw.workspaceId);

  const workspaces = await client('workspace')
    .whereIn('id', workspaceIds)
    .select('id', 'name', 'icon');

  return workspaces;
};
