import { handleError } from '../../../shared/utils/errors.js';
import cache from '../../cache/index.js';

const NotificationGetAllMiddleware = async (request, response) => {
  try {
    const notifications = await cache.notifications.getAll();

    return response.json(notifications);
  } catch (error) {
    handleError(error, response);
  }
};

export default NotificationGetAllMiddleware;
