import { handleError } from '../../utils/errors.js';
import cache from '../../cache/index.js';

const NotificationGetUsingIdMiddleware = async (request, response) => {
  const { notificationId } = request.query;

  try {
    const notification = await cache.notifications.getById(notificationId);
    return response.status(200).send(notification);
  } catch (error) {
    handleError(error, response);
  }
};

export default NotificationGetUsingIdMiddleware;
