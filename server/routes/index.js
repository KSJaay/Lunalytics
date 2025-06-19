import authorization from '../middleware/authorization.js';
import authRoutes from './auth.js';
import monitorRoutes from './monitor.js';
import notificationRoutes from './notifications.js';
import userRoutes from './user.js';
import statusPagesRoutes from './statusPages.js';
import statusApiRoutes from './statusApi.js';
import incidentRoutes from './incident.js';
import tokenRoutes from './tokens.js';
import defaultPageMiddleware from '../middleware/status/defaultPage.js';
import setupExistsMiddleware from '../middleware/setupExists.js';
import getStatusPageUsingIdMiddleware from '../middleware/status/statusPageUsingId.js';

const initialiseRoutes = async (app) => {
  app.use(setupExistsMiddleware);
  app.use('/auth', authRoutes);
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
  // Routes used for configuring status pages
  app.use('/api/status-pages', statusPagesRoutes);
};

export default initialiseRoutes;
