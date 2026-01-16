// import local files
import Collection from '../../shared/utils/collection.js';
import { cleanMonitorForStatusPage } from '../class/monitor/index.js';
import {
  fetchDailyHeartbeats,
  isMonitorDown,
} from '../database/queries/heartbeat.js';
import { fetchMonitor, monitorExists } from '../database/queries/monitor.js';
import {
  fetchAllMonitors,
  fetchAllStatusPages,
  fetchIncidentsUsingIdArray,
} from '../database/queries/status.js';
import { getMonitorIds, hasAutoAdd } from '../utils/status.js';

class Status {
  constructor() {
    this.statusPages = new Collection();
    this.monitors = new Collection();
    this.heartbeats = new Collection();
    this.incidents = new Collection();
  }

  async loadAllStatusPages(isInitialLoad = false) {
    const statusPages = await fetchAllStatusPages();

    if (hasAutoAdd(statusPages)) {
      const monitors = await fetchAllMonitors();

      for (const monitor of monitors) {
        await this.loadMonitorData(
          monitor.monitorId,
          monitor.workspaceId,
          monitor
        );
      }
    } else {
      for (const statusPage of statusPages) {
        const monitorIds = getMonitorIds(statusPage);
        for (const monitorId of monitorIds) {
          await this.loadMonitorData(monitorId, statusPage.workspaceId);
        }
      }
    }

    for (const statusPage of statusPages) {
      this.statusPages.set(statusPage.statusId, {
        ...statusPage,
        lastUpdated: new Date().toISOString(),
      });
    }

    if (isInitialLoad) {
      // Fetch all incidents for the 90 days
      const workspaceIds = this.monitors.map((monitor) => monitor.workspaceId);
      const uniqueWorkspaceIds = [...new Set(workspaceIds)];

      const monitorIds = [];
      for (const workspaceId of uniqueWorkspaceIds) {
        this.monitors.forEach((monitor) => {
          if (monitor.workspaceId === workspaceId) {
            monitorIds.push(monitor.monitorId);
          }
        });

        const incidents = await fetchIncidentsUsingIdArray(
          monitorIds,
          workspaceId
        );

        for (const incident of incidents) {
          this.incidents.set(incident.incidentId, incident);
        }
      }
    }
  }

  async loadMonitorData(monitorId, workspaceId, monitor) {
    if (!monitor) {
      const queryMonitor = await monitorExists(monitorId, workspaceId);

      if (!queryMonitor) {
        return;
      }

      const isDown = await isMonitorDown(
        queryMonitor.monitorId,
        queryMonitor.workspaceId,
        queryMonitor.retry
      );

      this.monitors.set(
        monitorId,
        cleanMonitorForStatusPage({ ...queryMonitor, isDown })
      );

      monitor = queryMonitor;
    } else {
      const isDown = await isMonitorDown(
        monitor.monitorId,
        monitor.workspaceId,
        monitor.retry
      );

      this.monitors.set(
        monitorId,
        cleanMonitorForStatusPage({ ...monitor, isDown })
      );
    }

    const heartbeats = await fetchDailyHeartbeats(
      monitorId,
      monitor.workspaceId
    );
    this.heartbeats.set(monitorId, heartbeats);
  }

  async updateStatusPage(statusPage) {
    if (hasAutoAdd(statusPage)) {
      const allMonitors = await fetchAllMonitors();

      for (const monitor of allMonitors) {
        if (this.monitors.has(monitor.monitorId)) {
          continue;
        }

        await this.loadMonitorData(monitor.monitorId, monitor);
      }
    } else {
      const monitorIds = getMonitorIds(statusPage);

      for (const monitorId of monitorIds) {
        if (this.monitors.has(monitorId)) {
          continue;
        }

        await this.loadMonitorData(monitorId);
      }
    }

    this.statusPages.set(statusPage.statusId, statusPage);
  }

  async addNewStatusPage(statusPage) {
    if (hasAutoAdd(statusPage)) {
      const allMonitors = await fetchAllMonitors();

      for (const monitor of allMonitors) {
        if (this.monitors.has(monitor.monitorId)) {
          continue;
        }

        await this.loadMonitorData(monitor.monitorId, monitor);
      }
    } else {
      const monitorIds = getMonitorIds(statusPage);

      for (const monitorId of monitorIds) {
        if (this.monitors.has(monitorId)) {
          continue;
        }

        await this.loadMonitorData(monitorId);
      }
    }

    this.statusPages.set(statusPage.statusId, statusPage);
  }

  deleteStatusPage(statusId) {
    this.statusPages.delete(statusId);
  }

  fetchStatusPage(statusId) {
    const statusPage = this.statusPages.get(statusId);

    if (!statusPage) {
      return null;
    }

    if (hasAutoAdd(statusPage)) {
      const monitors = this.monitors.toObject() || {};
      const heartbeats = this.heartbeats.toObject() || {};
      const incidents = this.incidents.toJSONValues() || {};

      return { ...statusPage, monitors, incidents, heartbeats };
    } else {
      const monitorIds = getMonitorIds(statusPage);

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

      const incidents =
        this.incidents
          ?.toJSONValues()
          ?.filter((incident) =>
            incident.monitorIds.some((id) => monitorIds.includes(id))
          ) || [];

      return { ...statusPage, monitors, incidents, heartbeats };
    }
  }

  addIncident(incident) {
    this.incidents.set(incident.incidentId, incident);
  }

  deleteIncident(incidentId) {
    this.incidents.delete(incidentId);
  }

  removeMonitor(monitorId, workspaceId) {
    this.monitors.delete(monitorId);
    this.heartbeats.delete(monitorId);
  }

  async reloadMonitor(monitorId, workspaceId) {
    const monitor = await fetchMonitor(monitorId, workspaceId).catch(
      () => false
    );

    if (!monitor) {
      return;
    }

    this.monitors.set(monitorId, cleanMonitorForStatusPage(monitor));
  }
}

const statusCache = new Status();
export default statusCache;
