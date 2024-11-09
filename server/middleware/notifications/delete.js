import { handleError } from '../../utils/errors.js';
import cache from '../../cache/index.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';

const NotificationDeleteMiddleware = async (request, response) => {
  const { notificationId } = request.query;

  if (!notificationId) {
    throw new UnprocessableError('No notificationId provided');
  }

  try {
    await cache.notifications.delete(notificationId);
    return response.status(200).send('Notification deleted');
  } catch (error) {
    handleError(error, response);
  }
};

export default NotificationDeleteMiddleware;
