// Import node_modules
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();

// import local files
const SQLite = require('./database/sqlite/setup');
const logger = require('./utils/logger');
const authorization = require('./middleware/authorization');
const initialiseRoutes = require('./routes');
const cache = require('./cache');

const app = express();

const init = async () => {
  // connect to database and setup database tables
  await SQLite.connect();
  await SQLite.setup();
  await cache.monitor.getMonitors();

  app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .disable('x-powered-by')
    .set('trust proxy', 1)
    .use(
      cors({
        origin: [process.env.APP_URL],
        credentials: true,
      })
    )
    .use(cookieParser());

  if (process.env.MODE === 'production') {
    app.use(express.static(path.join(__dirname, '..', '..', 'dist')));
  }

  app.use(authorization);
  logger.info('Express', 'Initialising routes');
  initialiseRoutes(app);

  if (process.env.MODE === 'production') {
    logger.info('Express', 'Serving production static files');
    app.get('*', function (request, response) {
      response.sendFile(path.join(__dirname, '..', '..', 'dist', 'index.html'));
    });
  }

  // Start the server
  const server_port = process.env.PORT || 5050;
  app.listen(server_port, () => {
    logger.info('Express', `Server is running on port ${server_port}`);
  });
};

init();
