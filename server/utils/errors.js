import {
  AuthorizationError,
  ConflictError,
  UnprocessableError,
} from '../../shared/utils/errors.js';
import logger from '../utils/logger.js';

const handleError = (error, response) => {
  logger.error('Error handler', { error: error.message, stack: error.stack });

  if (!response.headersSent) {
    if (error instanceof AuthorizationError) {
      return response.status(401).send({
        message: error.error,
      });
    }

    if (error instanceof ConflictError) {
      return response.status(409).send({
        message: error.error,
      });
    }

    if (error instanceof UnprocessableError) {
      return response.status(422).send({
        message: error.error,
      });
    }

    return response.status(500).send({
      message: 'Something went wrong',
    });
  }
};

export { handleError };
