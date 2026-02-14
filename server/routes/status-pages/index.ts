import { Router } from 'express';
import initialiseIdRoute from './id.js';
import initialiseCreateRoute from './create.js';
import initialiseDeleteRoute from './delete.js';
import initialiseUpdateRoute from './update.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';
import { memberHasPermission } from '../../middleware/hasPermission.js';

const statusPagesRouter = Router();

statusPagesRouter.use(
  memberHasPermission(MemberPermissionBits.VIEW_STATUS_PAGES)
);

initialiseIdRoute(statusPagesRouter);
initialiseCreateRoute(statusPagesRouter);
initialiseUpdateRoute(statusPagesRouter);
initialiseDeleteRoute(statusPagesRouter);

export default statusPagesRouter;
