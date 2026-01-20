// import type definitions
import type { Request, Response } from 'express';

// import local files
import { handleError } from '../../utils/errors.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';
import NotificationValidators from '../../../shared/validators/notifications/index.js';
import NotificationServices from '../../notifications/index.js';

const NotificationTestMiddleware = async (
  request: Request,
  response: Response
) => {
  const notification = request.body;

  try {
    const platform =
      notification?.platform as keyof typeof NotificationValidators;

    const validator = NotificationValidators[platform];

    if (!validator) {
      throw new UnprocessableError('Invalid Notification Platform');
    }

    const result = validator({ ...notification, ...notification.data });

    const servicePlatform =
      result.platform as keyof typeof NotificationServices;

    const ServiceClass = NotificationServices[servicePlatform];

    if (!ServiceClass) {
      throw new UnprocessableError('Invalid Notification Platform');
    }

    const service = new ServiceClass();

    await service.test(result as any);

    return response.status(200).send('Test notification sent');
  } catch (error) {
    handleError(error, response);
  }
};

export default NotificationTestMiddleware;
