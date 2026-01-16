import { handleError } from '../../utils/errors.js';
import { NOTIFICATION_ERRORS } from '../../../shared/constants/errors/notification.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';
import NotificationValidators from '../../../shared/validators/notifications/index.js';
import { editNotification } from '../../database/queries/notification.js';

const NotificationEditMiddleware = async (request, response) => {
  const notification = request.body;
  const { workspaceId } = response.locals;

  try {
    const validator = NotificationValidators[notification?.platform];

    if (!validator) {
      return response.status(400).json(NOTIFICATION_ERRORS.N003);
    }

    const result = validator({ ...notification.data, ...notification });

    const query = await editNotification({
      ...result,
      workspaceId: workspaceId,
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
