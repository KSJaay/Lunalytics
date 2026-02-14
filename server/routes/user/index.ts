import { Router } from 'express';
import initialiseBaseRoute from './base.js';
import initialiseExistsRoute from './exists.js';
import initialiseWorkspacesRoute from './workspaces.js';
import initialiseConnectionsRoute from './connections.js';
import initialiseUpdateAvatarRoute from './update-avatar.js';
import initialiseAccessRemoveRoute from './access-remove.js';
import initialiseAccessApproveRoute from './access-approve.js';
import initialiseAccessDeclineRoute from './access-decline.js';
import initialiseDeleteAccountRoute from './delete-account.js';
import initialiseUpdatePasswordRoute from './update-password.js';
import initialiseUpdateSettingsRoute from './update-settings.js';
import initialiseUpdateUsernameRoute from './update-username.js';
import initialiseConnectionDeleteRoute from './connection-delete.js';
import initialiseConnectionCreateRoute from './connection-create.js';
import initialisePermissionUpdateRoute from './permission-update.js';
import initialiseTransferOwnershipRoute from './transfer-ownership.js';

const userRouter = Router();

initialiseBaseRoute(userRouter);
initialiseExistsRoute(userRouter);
initialiseWorkspacesRoute(userRouter);
initialiseConnectionsRoute(userRouter);
initialiseUpdateAvatarRoute(userRouter);
initialiseAccessRemoveRoute(userRouter);
initialiseDeleteAccountRoute(userRouter);
initialiseAccessDeclineRoute(userRouter);
initialiseAccessApproveRoute(userRouter);
initialiseUpdateUsernameRoute(userRouter);
initialiseUpdatePasswordRoute(userRouter);
initialiseUpdateSettingsRoute(userRouter);
initialiseConnectionCreateRoute(userRouter);
initialiseConnectionDeleteRoute(userRouter);
initialisePermissionUpdateRoute(userRouter);
initialiseTransferOwnershipRoute(userRouter);

export default userRouter;
