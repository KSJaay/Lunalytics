import { handleError } from '../../../shared/utils/errors.js';
import cache from '../../cache/index.js';

const NotificationToggleMiddleware = async (request, response) => {
  const { notificationId, isEnabled } = request.query;

  try {
    await cache.notifications.toggle(notificationId, isEnabled === 'true');
    return response.sendStatus(200);
  } catch (error) {
    handleError(error, response);
  }
};

export default NotificationToggleMiddleware;
