import { handleError } from '../../utils/errors.js';
import cache from '../../cache/index.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';

const NotificationToggleMiddleware = async (request, response) => {
  const { notificationId, isEnabled } = request.query;

  if (!notificationId) {
    throw new UnprocessableError('No notificationId provided');
  }

  if (isEnabled !== 'true' && isEnabled !== 'false') {
    throw new UnprocessableError('isEnabled is not a boolean');
  }

  try {
    await cache.notifications.toggle(notificationId, isEnabled === 'true');
    return response.sendStatus(200);
  } catch (error) {
    handleError(error, response);
  }
};

export default NotificationToggleMiddleware;
