import type { Response } from 'express';

import {
  AuthorizationError,
  ConflictError,
  UnprocessableError,
  NotificationValidatorError,
} from '../../shared/utils/errors.js';
import logger from '../utils/logger.js';

const handleError = (error: any, response: Response) => {
  logger.error('Error handler', { error: error.message, stack: error.stack });

  if (!response.headersSent) {
    if (error instanceof AuthorizationError) {
      return response.status(401).send({
        message: error.message,
      });
    }

    if (error instanceof ConflictError) {
      return response.status(409).send({
        message: error.message,
      });
    }

    if (error instanceof UnprocessableError) {
      return response.status(422).send({
        message: error.message,
      });
    }

    if (error instanceof NotificationValidatorError) {
      return response.status(422).send({
        [error.key]: error.message,
      });
    }

    return response.status(500).send({
      message: 'Something went wrong',
    });
  }
};

export { handleError };
