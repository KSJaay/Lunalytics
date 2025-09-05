import { handleError } from '../../utils/errors.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';
import NotificationValidators from '../../../shared/validators/notifications/index.js';
import NotificationServices from '../../notifications/index.js';

const NotificationTestMiddleware = async (request, response) => {
  const notification = request.body;

  try {
    const validator = NotificationValidators[notification?.platform];

    if (!validator) {
      throw new UnprocessableError('Invalid Notification Platform');
    }

    const result = validator({ ...notification, ...notification.data });

    const ServiceClass = NotificationServices[result.platform];

    if (!ServiceClass) {
      throw new UnprocessableError('Invalid Notification Platform');
    }

    const service = new ServiceClass();

    await service.test(result);

    return response.status(200).send('Test notification sent');
  } catch (error) {
    handleError(error, response);
  }
};

export default NotificationTestMiddleware;
