const authRoutes = require('./auth');
const monitorRoutes = require('./monitor');
const userRoutes = require('./user');

const initialiseRoutes = async (app) => {
  app.use('/auth', authRoutes);
  app.use('/api/monitor', monitorRoutes);
  app.use('/api/user', userRoutes);
};

module.exports = initialiseRoutes;
