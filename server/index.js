import '../scripts/loadEnv.js';

// import dependencies
import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';

// import local files
import cache from './cache/index.js';
import logger from './utils/logger.js';
import initialiseRoutes from './routes/index.js';
import SQLite from './database/sqlite/setup.js';
import initialiseCronJobs from './utils/cron.js';
import authorization from './middleware/authorization.js';
import migrateDatabase from '../scripts/migrate.js';
import isDemo from './middleware/demo.js';

const app = express();

const init = async () => {
  // connect to database and setup database tables
  await SQLite.connect();
  await SQLite.setup();
  await cache.initialise();
  await migrateDatabase();
  const monitors = await cache.monitors.getAll();
  await cache.heartbeats.loadHeartbeats(monitors);
  await initialiseCronJobs();

  app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .disable('x-powered-by')
    .set('trust proxy', 1)
    .use(cookieParser())
    .use(isDemo);

  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.NODE_ENV !== 'test'
  ) {
    app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
  }

  if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
    logger.info('Express', 'Serving production static files');
    app.use(express.static(path.join(process.cwd(), 'dist')));
  }

  app.get('/api/status', (req, res) => {
    return res.status(200).send('Everything looks good :D');
  });

  app.get('/api/kanban', (req, res) => {
    return res.sendFile(path.join(process.cwd(), '/public/kanban.json'));
  });

  app.use(authorization);
  logger.info('Express', 'Initialising routes');
  initialiseRoutes(app);

  if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
    logger.info('Express', 'Serving production static files');
    app.get('*', function (request, response) {
      response.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    });
  }

  // Start the server
  const server_port = process.env.PORT || 2308;
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
