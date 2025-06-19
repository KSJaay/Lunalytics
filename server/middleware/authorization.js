import { getUserByEmail } from '../database/queries/user.js';
import { deleteCookie } from '../../shared/utils/cookies.js';
import { handleError } from '../utils/errors.js';
import { userSessionExists } from '../database/queries/session.js';
import { apiTokenExists } from '../database/queries/tokens.js';
import { oldPermsToFlags } from '../../shared/permissions/oldPermsToFlags.js';

const authorization = async (request, response, next) => {
  try {
    const { session_token } = request.cookies;
    const { authorization } = request.headers;

    if (session_token) {
      const userSession = await userSessionExists(session_token);

      if (!userSession) {
        deleteCookie(response, 'session_token');
        return response.sendStatus(401);
      }

      const userExistsInDatabase = await getUserByEmail(userSession.email);

      if (userExistsInDatabase) {
        // if user is trying to access `/api/user/verfied` and is already logged in, send user data
        if (request.url.startsWith('/api/user/verfied')) {
          return response.send(userExistsInDatabase);
        }

        if (!userExistsInDatabase.isVerified) {
          return response.sendStatus(403);
        }

        // if user is trying to access login or register page and is already logged in, redirect to home page
        if (
          request.url.startsWith('/login') ||
          request.url.startsWith('/register') ||
          request.url.startsWith('/setup')
        ) {
          return response.redirect('/home');
        }

        response.locals.user = {
          ...userExistsInDatabase,
          permission: oldPermsToFlags[userExistsInDatabase.permission],
          isOwner: userExistsInDatabase.permission === 1,
        };
      }

      if (!userExistsInDatabase) {
        deleteCookie(response, 'session_token');
        return response.sendStatus(401);
      }
    }

    if (request.url.startsWith('/api') && authorization) {
      const authorizationTokenExists = await apiTokenExists(authorization);

      if (!authorizationTokenExists) {
        return response.sendStatus(401);
      }

      response.locals.user = { ...authorizationTokenExists, isApiToken: true };
    }

    if (request.url.startsWith('/api') && !session_token && !authorization) {
      return response.sendStatus(401);
    }

    return next();
  } catch (error) {
    deleteCookie(response, 'session_token');
    handleError(error, response);
  }
};

export default authorization;
