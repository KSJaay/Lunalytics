import config from '../utils/config.js';
import { ownerExists } from '../database/queries/user.js';
import logger from '../utils/logger.js';

const setupExistsMiddleware = async (request, response, next) => {
  try {
    // Skip for setup page and assets to prevent infinite redirect loop
    if (request.url === '/setup' || request.url.startsWith('/assets')) {
      return next();
    }

    const databaseName = config.get('database')?.name;

    // If database is not configured
    if (!databaseName) {
      // Instead of redirecting, return a specific status that the frontend can intercept
      if (request.url.startsWith('/api/')) {
        return response.status(200).json({
          success: false,
          setupRequired: true,
          message: 'Application setup required',
        });
      }
      // For non-API requests, continue to the frontend which will handle the check
      return next();
    }

    if (databaseName) {
      const query = await ownerExists();

      if (!query) {
        // Instead of redirecting, return a specific status that the frontend can intercept
        if (request.url.startsWith('/api/')) {
          return response.status(200).json({
            success: false,
            setupRequired: true,
            message: 'Application setup required',
          });
        }
        // For non-API requests, continue to the frontend which will handle the check
        return next();
      }

      // If we're already on the setup page but everything is set up, this is optional
      if (request.url === '/setup') {
        // Let the frontend handle this
        return next();
      }
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
