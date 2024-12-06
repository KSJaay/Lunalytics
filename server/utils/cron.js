// import dependencies
import { CronJob } from 'cron';

// import local files
import logger from '../utils/logger.js';
import {
  createHourlyHeartbeat,
  fetchHeartbeatsByDate,
} from '../database/queries/heartbeat.js';
import { fetchMonitors } from '../database/queries/monitor.js';

// fetch all monitors
// fetch only heartbeats that are up for each monitor
// get the average response time for each monitor
// create a new record in the database

async function initialiseCronJobs() {
  logger.info('Cron', { message: 'Initialising cron jobs' });

  // Evert hour
  new CronJob(
    '0 * * * *',
    async function () {
      logger.info('Cron', {
        message: 'Running hourly cron job for creating heartbeat',
      });

      const monitorsList = await fetchMonitors();
      const monitors = Object.keys(monitorsList);

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
    },
    null,
    true,
    'Europe/London'
  );
}

export default initialiseCronJobs;
