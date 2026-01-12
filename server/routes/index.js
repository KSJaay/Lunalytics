import authRoutes from './auth.js';
import userRoutes from './user.js';
import tokenRoutes from './tokens.js';
import memberRoutes from './member.js';
import monitorRoutes from './monitor.js';
import invitesRoutes from './invites.js';
import incidentRoutes from './incident.js';
import providerRoutes from './provider.js';
import statusApiRoutes from './statusApi.js';
import workspaceRoutes from './workspace.js';
import statusPagesRoutes from './statusPages.js';
import notificationRoutes from './notifications.js';
import fetchIcons from '../middleware/fetchIcons.js';
import authorization from '../middleware/authorization.js';
import getAllDockerContainers from '../middleware/getDockerContainers.js';
import createPushHeartbeat from '../middleware/createPushHeartbeat.js';
import authorizeWorkspace from '../middleware/authorizeWorkspace.js';

// ! ALL ROUTES MUST START WITH /api PREFIX !

const initialiseRoutes = async (app) => {
  app.use('/api/auth', authRoutes);
  // Routes used for fetching public status pages
  app.use('/api/status', statusApiRoutes);
  app.post('/api/push', createPushHeartbeat);
  app.use(authorization);
  app.use('/api/admin', memberRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/workspace', workspaceRoutes);
  app.use(authorizeWorkspace);
  app.use('/api/monitor', monitorRoutes);
  app.use('/api/member', memberRoutes);
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
