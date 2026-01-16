// import dependencies
import { CronJob } from 'cron';

// import local files
import logger from '../utils/logger.js';
import {
  cleanHeartbeats,
  createHourlyHeartbeat,
  fetchHeartbeatsByDate,
} from '../database/queries/heartbeat.js';
import { fetchAllMonitors } from '../database/queries/monitor.js';
import config from './config.js';
import { stringToMs } from '../../shared/utils/ms.js';
import statusCache from '../cache/status.js';
import database from '../database/connection.js';
import { cleanUserSessions } from '../database/queries/session.js';

async function initialiseCronJobs() {
  logger.info('Cron', { message: 'Initialising cron jobs' });

  // Every 5 minutes
  new CronJob(
    '*/5 * * * *',
    async function () {
      try {
        await database.connect();

        logger.info('Cron', {
          message: 'Loading all status pages',
        });
        await statusCache.loadAllStatusPages();
      } catch (error: any) {
        logger.error('Cron - Updating status page', {
          error: error.message,
          stack: error.stack,
        });
      }
    },
    null,
    true,
    'Europe/London'
  );

  // Every hour
  new CronJob(
    '0 * * * *',
    async function () {
      try {
        await database.connect();

        logger.info('Cron', {
          message: 'Running hourly cron job for creating heartbeat',
        });

        const monitors = await fetchAllMonitors();

        if (monitors.length === 0) {
          return;
        }

        // the last hour on the hour
        const date = Date.now();
        const lastHour = date - 3600000 - (date % 3600000);

        for (const monitor of monitors) {
          const query = await fetchHeartbeatsByDate(
            monitor.monitorId,
            monitor.workspaceId,
            lastHour
          );

          if (query.length === 0) {
            continue;
          }

          const [lastMonitor] = query;

          const upHeartbeats = query.filter((h) => !h.isDown);

          if (upHeartbeats.length === 0) {
            continue;
          }

          const averageLatency = Math.round(
            upHeartbeats.reduce((acc, curr) => acc + curr.latency, 0) /
              upHeartbeats.length
          );

          const data = {
            monitorId: monitor.monitorId,
            workspaceId: monitor.workspaceId,
            date: new Date(lastHour).toISOString(),
            status: lastMonitor.status,
            latency: averageLatency,
          };

          await createHourlyHeartbeat(data);
        }
      } catch (error: any) {
        logger.error('Cron', {
          message: 'Error running hourly cron job for creating heartbeat',
          error: error.message,
          stack: error.stack,
        });
      }
    },
    null,
    true,
    'Europe/London'
  );

  // Cron at midnight
  new CronJob(
    '0 0 * * *',
    async function () {
      try {
        await database.connect();

        logger.info('Cron', {
          message: 'Running daily cron job for creating heartbeat',
        });

        const retention = config.get('retentionPeriod') || '6m';
        const rententionMs = stringToMs(retention);
        const date = new Date(Date.now() - rententionMs).toISOString();

        await cleanHeartbeats(date);
        await cleanUserSessions();

        logger.info('Cron', {
          message: 'Daily cron job complete',
        });
      } catch (error: any) {
        logger.error('Cron', {
          message: 'Error running daily cron job for creating heartbeat',
          error: error.message,
          stack: error.stack,
        });
      }
    },
    null,
    true,
    'Europe/London'
  );
}

export default initialiseCronJobs;
