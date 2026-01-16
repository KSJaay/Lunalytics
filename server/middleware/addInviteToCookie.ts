import { setServerSideCookie } from '../../shared/utils/cookies.js';
import logger from '../utils/logger.js';

const addInviteToCookie = (request, response, next) => {
  try {
    const { invite } = request.query;

    if (invite) {
      setServerSideCookie(
        response,
        'invite',
        invite,
        request.protocol === 'https',
        'lax'
      );
    }

    next();
  } catch (error) {
    logger.error('Add invite to cookie', {
      message: error.message,
      stack: error.stack,
    });
    next();
  }
};

export default addInviteToCookie;
