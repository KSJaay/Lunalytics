// import type definitions
import type { NextFunction, Request, Response } from 'express';

// import local files
import { setServerSideCookie } from '../../shared/utils/cookies.js';
import logger from '../utils/logger.js';

const addInviteToCookie = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { invite } = request.query;

    if (invite) {
      setServerSideCookie(
        response,
        'invite',
        invite as string,
        request.protocol === 'https',
        'lax'
      );
    }

    next();
  } catch (error: any) {
    logger.error('Add invite to cookie', {
      message: error.message,
      stack: error.stack,
    });
    next();
  }
};

export default addInviteToCookie;
