import authRoutes from './auth.js';
import userRoutes from './user.js';
import tokenRoutes from './tokens.js';
import monitorRoutes from './monitor.js';
import invitesRoutes from './invites.js';
import incidentRoutes from './incident.js';
import providerRoutes from './provider.js';
import statusApiRoutes from './statusApi.js';
import statusPagesRoutes from './statusPages.js';
import notificationRoutes from './notifications.js';
import fetchIcons from '../middleware/fetchIcons.js';
import authorization from '../middleware/authorization.js';
import defaultPageMiddleware from '../middleware/status/defaultPage.js';
import getAllDockerContainers from '../middleware/getDockerContainers.js';
import getStatusPageUsingIdMiddleware from '../middleware/status/statusPageUsingId.js';
import createPushHeartbeat from '../middleware/createPushHeartbeat.js';
import {
  WORKSPACE_ID_COOKIE,
  WORKSPACE_ID_HEADER,
} from '../../shared/constants/cookies.js';
import {
  createWorkspace,
  fetchDefaultWorkspace,
  fetchWorkspace,
} from '../database/queries/workspace.js';
import { setClientSideCookie } from '../../shared/utils/cookies.js';
import database from '../database/connection.js';
import { handleError } from '../utils/errors.js';
import { createMember } from '../database/queries/member.js';

const initialiseRoutes = async (app) => {
  app.use('/api/auth', authRoutes);
  app.get('/', defaultPageMiddleware);
  app.get('/status/:id', getStatusPageUsingIdMiddleware);
  // Routes used for fetching public status pages
  app.use('/api/status', statusApiRoutes);
  app.post('/api/push', createPushHeartbeat);
  app.use(authorization);
  app.post('/api/workspace/create', async (request, response) => {
    try {
      const { name, icon } = request.body;

      if (!name) {
        return response.status(400).send('Workspace name is required.');
      }

      if (name.length > 32) {
        return response
          .status(400)
          .send('Workspace name must be less than 32 characters.');
      }

      const workspace = await createWorkspace(
        name,
        icon,
        response.locals.user.email
      );

      await createMember({
        email: response.locals.user.email,
        workspaceId: workspace.id,
      });

      setClientSideCookie(response, WORKSPACE_ID_COOKIE, workspace.id);

      return response.status(201).send('Workspace created successfully.');
    } catch (error) {
      handleError(error, response);
    }
  });

  app.use(async (request, response, next) => {
    const workspaceId =
      request.headers[WORKSPACE_ID_HEADER] ||
      request.cookies[WORKSPACE_ID_COOKIE];

    if (!database.client) return next();

    let workspace = await fetchWorkspace(workspaceId);

    // ! REMOVE ONCE MULTI-WORKSPACE IS ADDED
    if (!workspace) {
      workspace = await fetchDefaultWorkspace();
    }

    if (!workspace?.id) {
      return response.status(403).send('Workspace not found');
    }

    setClientSideCookie(response, WORKSPACE_ID_COOKIE, workspace?.id);

    next();
  });
  app.use('/api/monitor', monitorRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/member', (request, response, next) => {
    console.log('Member routes are deprecated');
    next();
  });
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/incident', incidentRoutes);
  app.use('/api/tokens', tokenRoutes);
  app.use('/api/invite', invitesRoutes);
  app.use('/api/providers', providerRoutes);
  // Routes used for configuring status pages
  app.use('/api/status-pages', statusPagesRoutes);
  app.get('/api/icons', fetchIcons);
  app.get('/api/docker/containers', getAllDockerContainers);
};

export default initialiseRoutes;
