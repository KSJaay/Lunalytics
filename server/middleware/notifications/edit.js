import { handleError } from '../../utils/errors.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';
import NotificationValidators from '../../../shared/validators/notifications/index.js';
import cache from '../../cache/index.js';

const NotificationEditMiddleware = async (request, response) => {
  const notification = request.body;

  try {
    const validator = NotificationValidators[notification?.platform];

    if (!validator) {
      throw new UnprocessableError('Invalid Notification Platform');
    }

    const result = validator({ ...notification, ...notification.data });

    const query = await cache.notifications.edit({
      ...result,
      id: notification.id,
      email: notification.email,
      isEnabled: notification.isEnabled,
    });

    return response.json(query);
  } catch (error) {
    handleError(error, response);
  }
};

export default NotificationEditMiddleware;
