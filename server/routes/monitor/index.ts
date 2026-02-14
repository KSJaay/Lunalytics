import { Router } from 'express';
import initialisePauseRoute from './pause.js';
import initialiseDeleteRoute from './delete.js';
import initialiseEditRoute from './edit.js';
import initialiseAddRoute from './add.js';
import initialiseIdRoute from './id.js';
import initialiseStatusRoute from './status.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';
import { memberHasPermission } from '../../middleware/hasPermission.js';

const monitorRouter = Router();

monitorRouter.use(memberHasPermission(MemberPermissionBits.VIEW_MONITORS));

initialisePauseRoute(monitorRouter);
initialiseDeleteRoute(monitorRouter);
initialiseEditRoute(monitorRouter);
initialiseAddRoute(monitorRouter);
initialiseStatusRoute(monitorRouter);
initialiseIdRoute(monitorRouter);

export default monitorRouter;
