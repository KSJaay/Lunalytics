// import local files
import Collection from '../../shared/utils/collection.js';
import { cleanMonitorForStatusPage } from '../class/monitor.js';
import { fetchDailyHeartbeats } from '../database/queries/heartbeat.js';
import { monitorExists } from '../database/queries/monitor.js';
import {
  fetchAllMonitors,
  fetchAllStatusPages,
  fetchIncidentsUsindIdArray,
} from '../database/queries/status.js';

class Status {
  constructor() {
    this.statusPages = new Collection();
    this.monitors = new Collection();
    this.heartbeats = new Collection();
    this.incidents = new Collection();
  }

  async loadAllStatusPages(isInitialLoad = false) {
    const statusPages = await fetchAllStatusPages();

    const autoAddExists = statusPages.some((statusPage) => {
      return statusPage.layout.some(
        (item) =>
          (item.type === 'metrics' && item.autoAdd) ||
          (item.type === 'uptime' && item.autoAdd)
      );
    });

    if (autoAddExists) {
      const monitors = await fetchAllMonitors();

      for (const monitor of monitors) {
        const heartbeats = await fetchDailyHeartbeats(monitor.monitorId);
        this.heartbeats.set(monitor.monitorId, heartbeats);
        this.monitors.set(
          monitor.monitorId,
          cleanMonitorForStatusPage(monitor)
        );
      }
    } else {
      const monitorIds = [];

      for (const statusPage of statusPages) {
        statusPage.layout.forEach((item) => {
          if (item.monitors) {
            item.monitors.forEach((value) => {
              monitorIds.push(value?.id || value);
            });
          }
        });
      }

      for (const monitorId of monitorIds) {
        const heartbeats = await fetchDailyHeartbeats(monitorId);
        const monitor = await monitorExists(monitorId);

        this.heartbeats.set(monitorId, heartbeats);
        this.monitors.set(monitorId, cleanMonitorForStatusPage(monitor));
      }
    }

    if (isInitialLoad) {
      // Fetch all incidents for the 90 days
      const monitorIds = this.monitors.toJSONKeys();
      const incidents = await fetchIncidentsUsindIdArray(monitorIds);
      for (const incident of incidents) {
        const cacheIncidents = this.incidents.get(incident.monitorId) || [];
        cacheIncidents.push(incident);
        this.incidents.set(incident.monitorId, cacheIncidents);
      }

      for (const statusPage of statusPages) {
        this.statusPages.set(statusPage.statusId, statusPage);
      }
    }
  }

  updateStatusPage(statusPage) {
    this.statusPages.set(statusPage.statusId, statusPage);
  }

  fetchStatusPage(statusId) {
    const statusPage = this.statusPages.get(statusId);

    if (!statusPage) {
      return null;
    }

    const isAutoAdd = statusPage.layout.some((item) => {
      return (
        (item.type === 'metrics' && item.autoAdd) ||
        (item.type === 'uptime' && item.graphType !== 'Basic' && item.autoAdd)
      );
    });

    if (isAutoAdd) {
      const monitors = this.monitors.toObject() || {};
      const heartbeats = this.heartbeats.toObject() || {};
      const incidents = this.incidents.toObject() || {};

      return { ...statusPage, monitors, incidents, heartbeats };
    } else {
      const monitorIds = [];

      statusPage.layout.forEach((item) => {
        if (item.monitors) {
          item.monitors.forEach((value) => {
            monitorIds.push(value?.id || value);
          });
        }
      });

      const monitors = monitorIds.reduce((acc, monitorId) => {
        if (this.monitors.has(monitorId)) {
          return { ...acc, [monitorId]: this.monitors.get(monitorId) };
        }

        return acc;
      }, {});

      const heartbeats = monitorIds.reduce((acc, monitorId) => {
        if (this.heartbeats.has(monitorId)) {
          return { ...acc, [monitorId]: this.heartbeats.get(monitorId) };
        }

        return acc;
      }, {});

      const incidents = this.incidents.toJSON() || [];

      return { ...statusPage, monitors, incidents, heartbeats };
    }
  }
}

const statusCache = new Status();
export default statusCache;
