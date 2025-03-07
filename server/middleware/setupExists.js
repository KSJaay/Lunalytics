import config from '../utils/config.js';
import { ownerExists } from '../database/queries/user.js';
import logger from '../utils/logger.js';

const setupExistsMiddleware = async (request, response, next) => {
  try {
    const databaseName = config.get('database')?.name;

    if (!databaseName) {
      return response.redirect('/setup');
    }

    const query = await ownerExists();

    if (!query) {
      return response.redirect('/setup');
    }

    if (request.url === '/setup') {
      return response.redirect('/login');
    }

    next();
  } catch (error) {
    logger.error('SETUP EXISTS', {
      message: 'Unable to check if setup exists.',
      error: error.message,
      stack: error.stack,
    });
    next();
  }
};

export default setupExistsMiddleware;
