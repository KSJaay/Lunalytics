import { Router } from 'express';
import initialiseCreateRoute from './create.js';
import initialiseDeleteRoute from './delete.js';
import initialiseUpdateRoute from './update.js';
import initialiseMessagesCreateRoute from './messages-create.js';
import initialiseMessagesDeleteRoute from './messages-delete.js';
import initialiseMessagesUpdateRoute from './messages-update.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';
import { memberHasPermission } from '../../middleware/hasPermission.js';

const incidentRouter = Router();

incidentRouter.use(memberHasPermission(MemberPermissionBits.MANAGE_INCIDENTS));

initialiseCreateRoute(incidentRouter);
initialiseDeleteRoute(incidentRouter);
initialiseUpdateRoute(incidentRouter);
initialiseMessagesCreateRoute(incidentRouter);
initialiseMessagesDeleteRoute(incidentRouter);
initialiseMessagesUpdateRoute(incidentRouter);

export default incidentRouter;
