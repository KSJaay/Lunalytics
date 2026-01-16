import { handleError } from '../../utils/errors.js';
import { fetchNotifications } from '../../database/queries/notification.js';

const workspaceNotificationsMiddleware = async (request, response) => {
  try {
    const notifications = await fetchNotifications(response.locals.workspaceId);

    return response.json(notifications);
  } catch (error) {
    handleError(error, response);
  }
};

export default workspaceNotificationsMiddleware;
