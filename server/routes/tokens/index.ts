import { Router } from 'express';
import initialiseCreateRoute from './create.js';
import initialiseDeleteRoute from './delete.js';
import initialiseUpdateRoute from './update.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';
import { memberHasPermission } from '../../middleware/hasPermission.js';

const tokensRouter = Router();

tokensRouter.use(memberHasPermission(MemberPermissionBits.ADMINISTRATOR));

initialiseCreateRoute(tokensRouter);
initialiseDeleteRoute(tokensRouter);
initialiseUpdateRoute(tokensRouter);

export default tokensRouter;
