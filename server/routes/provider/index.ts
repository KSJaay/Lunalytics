import initialiseDeleteRoute from './delete.js';
import initialiseConfigureRoute from './configure.js';
import { Router } from 'express';
import initialiseBaseRoute from './base.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';
import { memberHasPermission } from '../../middleware/hasPermission.js';

const providerRouter = Router();

providerRouter.use(memberHasPermission(MemberPermissionBits.ADMINISTRATOR));

initialiseDeleteRoute(providerRouter);
initialiseConfigureRoute(providerRouter);
initialiseBaseRoute(providerRouter);

export default providerRouter;
