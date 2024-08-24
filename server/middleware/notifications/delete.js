import { handleError } from '../../../shared/utils/errors.js';
import cache from '../../cache/index.js';

const NotificationDeleteMiddleware = async (request, response) => {
  const { notificationId } = request.query;

  try {
    await cache.notifications.delete(notificationId);
    return response.status(200).send('Notification deleted');
  } catch (error) {
    handleError(error, response);
  }
};

export default NotificationDeleteMiddleware;
