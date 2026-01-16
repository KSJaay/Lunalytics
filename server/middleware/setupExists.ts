import config from '../utils/config.js';
import { ownerExists } from '../database/queries/user.js';
import logger from '../utils/logger.js';
import { handleError } from '../utils/errors.js';

const setupExistsMiddleware = async (request, response) => {
  try {
    const databaseName = config.get('database')?.name;

    if (!databaseName) {
      return response.status(200).json({
        success: false,
        setupRequired: true,
        message: 'Application setup required',
      });
    }

    if (databaseName) {
      const query = await ownerExists();

      if (!query) {
        return response.status(200).json({
          success: false,
          setupRequired: true,
          message: 'Application setup required',
        });
      }
    }

    return response.status(200).json({
      success: true,
      setupRequired: false,
      message: 'Setup has been completed',
    });
  } catch (error) {
    logger.error('SETUP EXISTS', {
      message: 'Unable to check if setup exists.',
      error: error.message,
      stack: error.stack,
    });
    handleError(error, response);
  }
};

export default setupExistsMiddleware;
