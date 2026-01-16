// import dependencies
import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import compression from 'compression';

// import local files
import cache from './cache/monitor/index.js';
import logger from './utils/logger.js';
import config from './utils/config.js';
import isDemo from './middleware/demo.js';
import statusCache from './cache/status.js';
import database from './database/connection.js';
import initialiseRoutes from './routes/index.js';
import initialiseCronJobs from './utils/cron.js';
import migrateDatabase from '../scripts/migrate.js';
import addInviteToCookie from './middleware/addInviteToCookie.js';
import { loadIcons } from './utils/icons.js';
import { getVersionInfo, startVersionCheck } from './utils/checkVersion.js';
import defaultPageMiddleware from './middleware/status/defaultPage.js';
import getStatusPageUsingIdMiddleware from './middleware/status/statusPageUsingId.js';

const app = express();

const isProductionOrTest =
  process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test';
const corsList = config.get('cors');
const port = config.get('port');

const init = async () => {
  // connect to database and setup database tables
  await database.connect();
  const databaseExists = await database.setup();

  if (databaseExists) {
    await migrateDatabase();
    await cache.initialise();
    await statusCache.loadAllStatusPages(true);
    await initialiseCronJobs();
  }

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

  app.get('/', defaultPageMiddleware);
  app.get('/status/:id', getStatusPageUsingIdMiddleware);

  if (isProductionOrTest) {
    const distPath = path.join(process.cwd(), 'dist');
    app.use((req, res, next) => {
      if (!req.path.startsWith('/api')) {
        if (req.method === 'GET' && req.path.match(/\.[a-zA-Z0-9]+$/)) {
          return res.sendFile(path.join(distPath, req.path), (err) => {
            if (err) {
              return res.sendFile(path.join(distPath, 'index.html'));
            }
          });
        }
        if (req.method === 'GET') {
          return res.sendFile(path.join(distPath, 'index.html'));
        }
      }
      next();
    });
  }

  app.get('/api/ping', (req, res) => {
    return res.status(200).send('Everything looks good :D');
  });

  app.get('/api/version', (req, res) => {
    return res.status(200).json(getVersionInfo());
  });

  logger.notice('Express', { message: 'Initialising routes' });
  initialiseRoutes(app);

  // if (isProductionOrTest) {
  //   logger.notice('Express', { message: 'Serving production static files' });
  //   app.use(express.static(path.join(process.cwd(), 'dist')));
  // }

  // if (isProductionOrTest) {
  //   logger.notice('Express', { message: 'Serving production static files' });
  //   app.get('*', function (request, response) {
  //     response.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
  //   });
  // }

  // Start the server
  const server_port = port || 2308;
  app.listen(server_port, () => {
    logger.notice('Express', {
      message: `Server is running on port ${server_port}`,
    });
  });

  process.on('uncaughtException', async (error: Error) => {
    logger.error('Express Exception', {
      error: error.message,
      stack: error.stack,
    });
  });

  process.on('unhandledRejection', async (error: Error) => {
    logger.error('Express Rejection', {
      error: error.message,
      stack: error.stack,
    });
  });
};

init();
