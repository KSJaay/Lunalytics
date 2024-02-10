// import dependencies
const CronJob = require('cron').CronJob;

// import local files
const cache = require('../cache');
const logger = require('./logger');
const {
  fetchHeartbeatsByDate,
  fetchLastDailyHeartbeat,
} = require('../database/queries/heartbeat');

// fetch all monitors
// fetch only heartbeats that are up for each monitor
// get the average response time for each monitor
// create a new record in the database

async function initialiseCronJobs() {
  logger.info('Cron', 'Initialising cron jobs');

  new CronJob(
    '0 * * * *',
    async function () {
      logger.info('Cron', 'Running hourly cron job for creating heartbeat');

      const monitors = await cache.monitors.getKeys();

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
          date: lastHour,
          status: lastMonitor.status,
          latency: averageLatency,
        };

        await cache.heartbeats.addHourlyHeartbeat(monitorId, data);
      }
    },
    null,
    true,
    'Europe/London'
  );

  // every 5 minutes
  new CronJob(
    '*/5 * * * *',
    async function () {
      logger.info('Cron', 'Running 5 minute cron job for fetching heartbeats');

      const monitors = await cache.monitors.getKeys();

      if (monitors.length === 0) {
        return;
      }

      for (const monitorId of monitors) {
        const query = await fetchLastDailyHeartbeat(monitorId);

        cache.heartbeats.addFifthMinuteHeartbeat(monitorId, query);
      }
    },
    null,
    true,
    'Europe/London'
  );
}

module.exports = initialiseCronJobs;
