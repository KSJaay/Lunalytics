import { timeToMs } from '../../shared/utils/ms.js';
import { userSessionExists } from '../database/queries/session.js';
import { getUserByEmail } from '../database/queries/user.js';

const sessionLifetime = timeToMs(60, 'days');

// Returns the verified user for a session cookie. Anything else gives null.
// A session only counts while it is under 60 days old and its user has been
// verified. These are the rules the authorization middleware applies to the
// /api routes behind it.
export const getVerifiedSessionUser = async (sessionToken) => {
  if (!sessionToken) return null;

  const session = await userSessionExists(sessionToken);

  if (!session) return null;

  if (new Date(session.createdAt).getTime() + sessionLifetime < Date.now()) {
    return null;
  }

  const user = await getUserByEmail(session.email);

  return user?.isVerified ? user : null;
};
