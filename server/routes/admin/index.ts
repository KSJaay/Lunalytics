import initialiseWorkspacesRoute from './workspaces.js';
import { Router } from 'express';
import initialiseUsersRoute from './users.js';

const adminRouter = Router();

initialiseUsersRoute(adminRouter);
initialiseWorkspacesRoute(adminRouter);

export default adminRouter;
