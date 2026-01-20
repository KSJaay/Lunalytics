// import type definitions
import type { Request, Response } from 'express';

// import local files
import { handleError } from '../../utils/errors.js';
import { NOTIFICATION_ERRORS } from '../../../shared/constants/errors/notification.js';
import NotificationValidators from '../../../shared/validators/notifications/index.js';
import { createNotification } from '../../database/queries/notification.js';
import randomId from '../../utils/randomId.js';

const NotificationCreateMiddleware = async (
  request: Request,
  response: Response
) => {
  const notification = request.body;

  try {
    const platform =
      notification?.platform as keyof typeof NotificationValidators;

    const validator = NotificationValidators[platform];

    if (!validator) {
      return response.status(400).json(NOTIFICATION_ERRORS.N003);
    }

    const result = validator({ ...notification, ...notification.data });

    const { user, workspaceId } = response.locals;

    const uniqueId = randomId();
    const query = await createNotification({
      ...result,
      workspaceId: workspaceId,
      email: user.email,
      id: uniqueId,
      isEnabled: true,
      created_at: new Date().toISOString(),
    });

    return response.status(201).send(query);
  } catch (error) {
    handleError(error, response);
  }
};

export default NotificationCreateMiddleware;
