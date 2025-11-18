// import dependencies
import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import compression from 'compression';

// import local files
import cache from './cache/index.js';
import logger from './utils/logger.js';
import config from './utils/config.js';
import isDemo from './middleware/demo.js';
import statusCache from './cache/status.js';
import SQLite from './database/sqlite/setup.js';
import initialiseRoutes from './routes/index.js';
import initialiseCronJobs from './utils/cron.js';
import migrateDatabase from '../scripts/migrate.js';
import addInviteToCookie from './middleware/addInviteToCookie.js';
import { loadIcons } from './utils/icons.js';
import {
  getVersionInfo,
  startVersionCheck
} from './utils/checkVersion.js';

const app = express();

const isProductionOrTest =
  process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test';

const corsList = config.get('cors');
const isDemoMode = config.get('isDemo');
const port = config.get('port');

const init = async () => {
  // connect to database and setup database tables
  await SQLite.connect();
  const databaseExists = await SQLite.setup();

  if (databaseExists) {
    await cache.initialise();
    await migrateDatabase();
    await statusCache.loadAllStatusPages(true);
  }

  await initialiseCronJobs();
  await loadIcons();
  startVersionCheck();

  app
    .use(compression())
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .disable('x-powered-by')
    .set('trust proxy', 1)
    .use(cookieParser())
    .use(isDemo)
    .use(addInviteToCookie);

  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.NODE_ENV !== 'test'
  ) {
    app.use(
      cors({
        credentials: true,
        origin: corsList || ['http://localhost:3000'],
      })
    );
  } else {
    if (corsList) {
      app.use(cors({ credentials: true, origin: corsList }));
    }
  }

  app.get('/api/ping', (req, res) => {
    return res.status(200).send('Everything looks good :D');
  });

  app.get('/api/version', (req, res) => {
    return res.status(200).json(getVersionInfo());
  });

  if (isDemoMode) {
    app.get('/api/kanban', (req, res) => {
      return res.sendFile(path.join(process.cwd(), '/public/kanban.json'));
    });
  }

  logger.notice('Express', { message: 'Initialising routes' });
  initialiseRoutes(app);

  if (isProductionOrTest) {
    logger.notice('Express', { message: 'Serving production static files' });
    app.use(express.static(path.join(process.cwd(), 'dist')));
  }

  if (isProductionOrTest) {
    logger.notice('Express', { message: 'Serving production static files' });
    app.get('*', function (request, response) {
      response.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    });
  }

  // Start the server
  const server_port = port || 2308;
  app.listen(server_port, () => {
    logger.notice('Express', {
      message: `Server is running on port ${server_port}`,
    });
  });

  process.on('uncaughtException', async (error) => {
    logger.error('Express Exception', {
      error: error.message,
      stack: error.stack,
    });
  });

  process.on('unhandledRejection', async (error) => {
    logger.error('Express Rejection', {
      error: error.message,
      stack: error.stack,
    });
  });
};

init();
