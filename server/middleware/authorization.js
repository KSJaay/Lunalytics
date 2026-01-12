import { getUserByEmail } from '../database/queries/user.js';
import { deleteCookie } from '../../shared/utils/cookies.js';
import { handleError } from '../utils/errors.js';
import { userSessionExists } from '../database/queries/session.js';
import { apiTokenExists } from '../database/queries/tokens.js';
import { timeToMs } from '../../shared/utils/ms.js';
import {
  SESSION_TOKEN,
  WORKSPACE_ID_COOKIE,
} from '../../shared/constants/cookies.js';

const sixtyDaysInHours = timeToMs(60, 'days');

const authorization = async (request, response, next) => {
  try {
    const { [SESSION_TOKEN]: session_token } = request.cookies;

    const authorization =
      request.headers.authorization || request.headers.Authorization;

    if (session_token) {
      const userSession = await userSessionExists(session_token);

      if (!userSession) {
        deleteCookie(response, SESSION_TOKEN);
        deleteCookie(response, WORKSPACE_ID_COOKIE);
        return response.sendStatus(401);
      }

      const createdAt =
        new Date(userSession.created_at).getTime() + sixtyDaysInHours;

      if (createdAt < Date.now()) {
        deleteCookie(response, SESSION_TOKEN);
        deleteCookie(response, WORKSPACE_ID_COOKIE);
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

        response.locals.user = userExistsInDatabase;
      }

      if (!userExistsInDatabase) {
        deleteCookie(response, SESSION_TOKEN);
        deleteCookie(response, WORKSPACE_ID_COOKIE);
        return response.sendStatus(401);
      }
    }

    if (request.url.startsWith('/api') && authorization) {
      const authorizationTokenExists = await apiTokenExists(authorization);

      if (!authorizationTokenExists) {
        return response.sendStatus(401);
      }

      response.locals.user = {
        ...authorizationTokenExists,
        isApiToken: true,
      };
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
