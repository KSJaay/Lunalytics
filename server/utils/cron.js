// import dependencies
import { CronJob } from 'cron';

// import local files
import logger from '../utils/logger.js';
import {
  cleanHeartbeats,
  createHourlyHeartbeat,
  fetchHeartbeatsByDate,
} from '../database/queries/heartbeat.js';
import { fetchMonitors } from '../database/queries/monitor.js';
import config from './config.js';
import { stringToMs } from '../../shared/utils/ms.js';

// fetch all monitors
// fetch only heartbeats that are up for each monitor
// get the average response time for each monitor
// create a new record in the database

async function initialiseCronJobs() {
  logger.info('Cron', { message: 'Initialising cron jobs' });

  // Every hour
  new CronJob(
    '0 * * * *',
    async function () {
      try {
        logger.info('Cron', {
          message: 'Running hourly cron job for creating heartbeat',
        });

        const monitorsList = await fetchMonitors();
        const monitors = monitorsList.map((monitor) => monitor.monitorId);

        if (monitors.length === 0) {
          return;
        }

        // the last hour on the hour
        const date = Date.now();
        const lastHour = date - 3600000 - (date % 3600000);

        for (const monitorId of monitors) {
          const query = await fetchHeartbeatsByDate(monitorId, lastHour);

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
            monitorId,
            date: new Date(lastHour).toISOString(),
            status: lastMonitor.status,
            latency: averageLatency,
          };

          await createHourlyHeartbeat(data);
        }
      } catch (error) {
        logger.error('Cron', {
          message: 'Error running hourly cron job for creating heartbeat',
          error: error.message,
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
        logger.info('Cron', {
          message: 'Running daily cron job for creating heartbeat',
        });

        const retention = config.get('retentionPeriod') || '6m';
        const rententionMs = stringToMs(retention);
        const date = new Date(Date.now() - rententionMs).toISOString();

        await cleanHeartbeats(date);

        logger.info('Cron', {
          message: 'Daily cron job complete',
        });
      } catch (error) {
        logger.error('Cron', {
          message: 'Error running daily cron job for creating heartbeat',
          error: error.message,
        });
      }
    },
    null,
    true,
    'Europe/London'
  );
}

export default initialiseCronJobs;
