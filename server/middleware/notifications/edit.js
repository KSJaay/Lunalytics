import { handleError } from '../../utils/errors.js';
import { UnprocessableError } from '../../../shared/utils/errors.js';
import NotificationValidators from '../../../shared/validators/notifications/index.js';
import { editNotification } from '../../database/queries/notification.js';

const NotificationEditMiddleware = async (request, response) => {
  const notification = request.body;
  const { user } = response.locals;

  try {
    const validator = NotificationValidators[notification?.platform];

    if (!validator) {
      throw new UnprocessableError('Invalid Notification Platform');
    }

    const result = validator({ ...notification.data, ...notification });

    const query = await editNotification({
      ...result,
      workspaceId: user.workspaceId,
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
