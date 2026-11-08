// import type definitions
import type { NextFunction, Request, Response } from 'express';

// import local files
import { getUserByEmail } from '../database/queries/user.js';
import { deleteCookie } from '../../shared/utils/cookies.js';
import { handleError } from '../utils/errors.js';
import { AUTH_ERRORS } from '../../shared/constants/errors/auth.js';
import { userSessionExists } from '../database/queries/session.js';
import { rotateUserSession } from '../database/queries/session.js';
import { apiTokenExists } from '../database/queries/tokens.js';
import { timeToMs } from '../../shared/utils/ms.js';
import {
  SESSION_TOKEN,
  WORKSPACE_ID_COOKIE,
} from '../../shared/constants/cookies.js';
import { setServerSideCookie } from '../../shared/utils/cookies.js';

const thirtyDaysInMs = timeToMs(30, 'days');
const oneDayInMs = timeToMs(1, 'days');

const authorization = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { [SESSION_TOKEN]: session_token } = request.cookies;

    const authorization =
      request.headers.authorization || request.headers.Authorization;

    if (session_token) {
      const userSession = await userSessionExists(session_token);

      if (!userSession) {
        deleteCookie(response, SESSION_TOKEN);
        deleteCookie(response, WORKSPACE_ID_COOKIE);
        return response.status(401).json(AUTH_ERRORS.A004);
      }

      const createdAt =
        new Date(userSession.created_at).getTime() + thirtyDaysInMs;

      if (createdAt < Date.now()) {
        deleteCookie(response, SESSION_TOKEN);
        deleteCookie(response, WORKSPACE_ID_COOKIE);
        return response.status(401).json(AUTH_ERRORS.A003);
      }

      // Rotate session token if older than 24 hours
      const sessionAge =
        Date.now() - new Date(userSession.created_at).getTime();
      if (sessionAge > oneDayInMs) {
        const newToken = await rotateUserSession(session_token);
        setServerSideCookie(
          response,
          SESSION_TOKEN,
          newToken,
          request.protocol === 'https'
        );
      }

      const userExistsInDatabase = await getUserByEmail(userSession.email);

      if (userExistsInDatabase) {
        // if user is trying to access `/api/user/verfied` and is already logged in, send user data
        if (request.url.startsWith('/api/user/verfied')) {
          return response.send(userExistsInDatabase);
        }

        if (!userExistsInDatabase.isVerified) {
          return response
            .status(403)
            .json({ ...AUTH_ERRORS.A004, details: 'User not verified' });
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
        return response.status(401).json(AUTH_ERRORS.A004);
      }
    }

    if (
      request.url.startsWith('/api') &&
      authorization &&
      typeof authorization === 'string'
    ) {
      const authorizationTokenExists = await apiTokenExists(authorization);

      if (!authorizationTokenExists) {
        return response.status(401).json(AUTH_ERRORS.A001);
      }

      response.locals.user = {
        ...authorizationTokenExists,
        isApiToken: true,
      };
    }

    if (request.url.startsWith('/api') && !session_token && !authorization) {
      return response.status(401).json(AUTH_ERRORS.A002);
    }

    return next();
  } catch (error) {
    deleteCookie(response, 'session_token');
    handleError(error, response);
  }
};

export default authorization;
