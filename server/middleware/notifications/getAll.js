import { handleError } from '../../utils/errors.js';
import { fetchNotifications } from '../../database/queries/notification.js';

const NotificationGetAllMiddleware = async (request, response) => {
  try {
    const notifications = await fetchNotifications();

    return response.json(notifications);
  } catch (error) {
    handleError(error, response);
  }
};

export default NotificationGetAllMiddleware;
