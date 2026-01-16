import { handleError } from '../../utils/errors.js';
import { fetchNotifications } from '../../database/queries/notification.js';
import { NOTIFICATION_ERRORS } from '../../../shared/constants/errors/notification.js';

const NotificationGetAllMiddleware = async (request, response) => {
  try {
    const notifications = await fetchNotifications(response.locals.workspaceId);
    if (!notifications || notifications.length === 0) {
      return response.status(404).json(NOTIFICATION_ERRORS.N001);
    }
    return response.json(notifications);
  } catch (error) {
    handleError(error, response);
  }
};

export default NotificationGetAllMiddleware;
