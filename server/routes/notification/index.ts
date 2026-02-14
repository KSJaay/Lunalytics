import { Router } from 'express';
import initialiseTestRoute from './test.js';
import initialiseToggleRoute from './toggle.js';
import initialiseDeleteRoute from './delete.js';
import initialiseEditRoute from './edit.js';
import initialiseCreateRoute from './create.js';
import initialiseIdRoute from './id.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';
import { memberHasPermission } from '../../middleware/hasPermission.js';

const notificationRouter = Router();

notificationRouter.use(
  memberHasPermission(MemberPermissionBits.VIEW_NOTIFICATIONS)
);

initialiseIdRoute(notificationRouter);
initialiseCreateRoute(notificationRouter);
initialiseEditRoute(notificationRouter);
initialiseDeleteRoute(notificationRouter);
initialiseToggleRoute(notificationRouter);
initialiseTestRoute(notificationRouter);

export default notificationRouter;
