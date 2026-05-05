// import type definitions
import type { Application, NextFunction, Request, Response } from 'express';

// import node modules
import { games } from 'gamedig';

// import local files
import authRoutes from './auth/index.js';
import userRoutes from './user/index.js';
import tokenRoutes from './tokens/index.js';
import monitorRoutes from './monitor/index.js';
import invitesRoutes from './invites/index.js';
import incidentRoutes from './incident/index.js';
import providerRoutes from './provider/index.js';
import statusApiRoutes from './statusApi.js';
import workspaceRoutes from './workspace/index.js';
import statusPagesRoutes from './status-pages/index.js';
import notificationRoutes from './notification/index.js';
import fetchIcons from '../middleware/fetchIcons.js';
import authorization from '../middleware/authorization.js';
import { csrfProtection } from '../middleware/csrf.js';
import getAllDockerContainers from '../middleware/getDockerContainers.js';
import createPushHeartbeat from '../middleware/createPushHeartbeat.js';
import authorizeWorkspace from '../middleware/authorizeWorkspace.js';
import adminRouter from './admin/index.js';

const gamesList = Object.entries(games)
  .map(([key, value]) => ({
    id: key,
    n: `${value.name} (${value.release_year})`,
    p: value.options?.port,
  }))
  .sort((a, b) => a.n.localeCompare(b.n));

// ! ALL ROUTES MUST START WITH /api PREFIX !

const initialiseRoutes = async (app: Application) => {
  app.use(authRoutes);
  // Routes used for fetching public status pages
  app.use('/api/status', statusApiRoutes);
  app.post('/api/push', createPushHeartbeat);
  app.use(authorization);
  // app.use(csrfProtection);
  app.use(adminRouter);
  app.use(userRoutes);
  app.use(workspaceRoutes);
  app.use(authorizeWorkspace);
  app.use(monitorRoutes);
  app.use(notificationRoutes);
  app.use(incidentRoutes);
  app.use(tokenRoutes);
  app.use(invitesRoutes);
  app.use(providerRoutes);
  // Routes used for configuring status pages
  app.use(statusPagesRoutes);
  app.get('/api/icons', fetchIcons);
  app.get('/api/docker/containers', getAllDockerContainers);
  app.get('/api/games', async (_request: Request, response: Response) => {
    return response.status(200).json(gamesList);
  });
};

export default initialiseRoutes;
