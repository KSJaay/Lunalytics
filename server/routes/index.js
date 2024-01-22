const { register, login, logout } = require('../middleware/auth');
const monitorRoutes = require('./monitor');
const userRoutes = require('./user');

const initialiseRoutes = async (app) => {
  app.post('/register', register);
  app.post('/login', login);
  app.get('/logout', logout);
  app.use('/api/monitor', monitorRoutes);
  app.use('/api/user', userRoutes);
};

module.exports = initialiseRoutes;
