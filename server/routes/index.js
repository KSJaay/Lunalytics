const authRoutes = require('./auth');
const monitorRoutes = require('./monitor');
const userRoutes = require('./user');

const initialiseRoutes = async (app) => {
  app.use('', authRoutes);
  app.use('/monitor', monitorRoutes);
  app.use('/user', userRoutes);
};

module.exports = initialiseRoutes;
