import authorization from '../middleware/authorization.js';
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
import setupExistsMiddleware from '../middleware/setupExists.js';
import defaultPageMiddleware from '../middleware/status/defaultPage.js';
import getAllDockerContainers from '../middleware/getDockerContainers.js';
import getStatusPageUsingIdMiddleware from '../middleware/status/statusPageUsingId.js';

const initialiseRoutes = async (app) => {
  app.use(setupExistsMiddleware);
  app.use('/api/auth', authRoutes);
  app.get('/', defaultPageMiddleware);
  app.get('/status/:id', getStatusPageUsingIdMiddleware);
  // Routes used for fetching public status pages
  app.use('/api/status', statusApiRoutes);
  app.use(authorization);
  app.use('/api/monitor', monitorRoutes);
  app.use('/api/user', userRoutes);
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
