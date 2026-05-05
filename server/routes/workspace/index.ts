import { Router } from 'express';
import initialiseApiTokensRoute from './api-tokens.js';
import initialiseStatusPagesRoute from './status-pages.js';
import initialiseIncidentsRoute from './incidents.js';
import initialiseNotificationsRoute from './notifications.js';
import initialiseMonitorsRoute from './monitors.js';
import initialiseMembersRoute from './members.js';
import initialiseMembersMeRoute from './members-@me.js';
import initialiseCreateRoute from './create.js';
import initialiseJoinRoute from './join.js';

const workspaceRouter = Router();

initialiseApiTokensRoute(workspaceRouter);
initialiseCreateRoute(workspaceRouter);
initialiseIncidentsRoute(workspaceRouter);
initialiseMembersMeRoute(workspaceRouter);
initialiseMembersRoute(workspaceRouter);
initialiseMonitorsRoute(workspaceRouter);
initialiseNotificationsRoute(workspaceRouter);
initialiseStatusPagesRoute(workspaceRouter);
initialiseJoinRoute(workspaceRouter);

export default workspaceRouter;
