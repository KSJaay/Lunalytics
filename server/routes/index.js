import authRoutes from './auth.js';
import monitorRoutes from './monitor.js';
import notificationRoutes from './notifications.js';
import userRoutes from './user.js';

const initialiseRoutes = async (app) => {
  app.use('/auth', authRoutes);
  app.use('/api/monitor', monitorRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/notifications', notificationRoutes);
};

export default initialiseRoutes;
