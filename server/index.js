// Import dependencies
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
  await cache.initialise();

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

  if (process.env.NODE_ENV === 'production') {
    logger.info('Express', 'Serving production static files');
    app.use(express.static(path.join(process.cwd(), 'dist')));
  }

  app.use(authorization);
  logger.info('Express', 'Initialising routes');
  initialiseRoutes(app);

  if (process.env.NODE_ENV === 'production') {
    logger.info('Express', 'Serving production static files');
    app.get('*', function (request, response) {
      response.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    });
  }

  // Start the server
  const server_port = process.env.PORT || 5050;
  app.listen(server_port, () => {
    logger.info('Express', `Server is running on port ${server_port}`);
  });

  process.on('uncaughtException', async (error) => {
    logger.error('Express Exception', error);
  });

  process.on('unhandledRejection', async (error) => {
    logger.error('Express Rejection', error);
  });
};

init();
