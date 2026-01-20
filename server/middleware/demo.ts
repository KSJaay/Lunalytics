// import type definitions
import type { NextFunction, Request, Response } from 'express';

// import local files
import config from '../utils/config.js';
import { setDemoCookie } from '../../shared/utils/cookies.js';
import { SESSION_TOKEN } from '../../shared/constants/cookies.js';
import { getDemoUser, resetDemoUser } from '../database/queries/user.js';

const isDemoMode = config.get('isDemo');

const isDemo = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { session_token } = request.cookies;

  if (process.env.NODE_ENV === 'production' && isDemoMode && !session_token) {
    if (
      !request.url.startsWith('/register') &&
      !request.url.startsWith('/login')
    ) {
      const cookie = await getDemoUser();
      setDemoCookie(response, SESSION_TOKEN, cookie);
      request.cookies[SESSION_TOKEN] = cookie;
    }
  }

  if (process.env.NODE_ENV === 'production' && isDemoMode) {
    await resetDemoUser();
  }

  return next();
};

export default isDemo;
