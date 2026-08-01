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
  statusPages: Collection;
  monitors: Collection;
  heartbeats: Collection;
  incidents: Collection;

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

      if (monitors && monitors.length > 0) {
        for (const monitor of monitors) {
          await this.loadMonitorData(
            monitor.monitorId,
            monitor.workspaceId,
            monitor
          );
        }
      }
    } else {
      if (statusPages && statusPages.length > 0) {
        for (const statusPage of statusPages) {
          const monitorIds = getMonitorIds(statusPage);
          for (const monitorId of monitorIds) {
            await this.loadMonitorData(monitorId, statusPage.workspaceId);
          }
        }
      }
    }

    if (statusPages && statusPages.length > 0) {
      for (const statusPage of statusPages) {
        const statusPageId = `${statusPage.statusId}:${statusPage.workspaceId}`;
        this.statusPages.set(statusPageId, {
          ...statusPage,
          lastUpdated: new Date().toISOString(),
        });
      }
    }

    if (isInitialLoad) {
      // Fetch all incidents for the 90 days
      const workspaceIds = this.monitors.map((monitor) => monitor.workspaceId);
      const uniqueWorkspaceIds = [...new Set(workspaceIds)];

      const monitorIds = [] as string[];

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

        if (incidents && incidents.length > 0) {
          for (const incident of incidents) {
            const incidentCacheId = `${incident.incidentId}:${workspaceId}`;
            this.incidents.set(incidentCacheId, incident);
          }
        }
      }
    }
  }

  async loadMonitorData(monitorId: string, workspaceId: string, monitor?: any) {
    const monitorCacheId = `${monitorId}:${workspaceId}`;

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
        monitorCacheId,
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
        monitorCacheId,
        cleanMonitorForStatusPage({ ...monitor, isDown })
      );
    }

    const heartbeats = await fetchDailyHeartbeats(
      monitor.monitorId,
      monitor.workspaceId
    );
    this.heartbeats.set(monitorCacheId, heartbeats);
  }

  async updateStatusPage(statusPage: any) {
    if (hasAutoAdd(statusPage)) {
      const allMonitors = await fetchAllMonitors();

      if (allMonitors && allMonitors.length > 0) {
        for (const monitor of allMonitors) {
          const monitorCacheId = `${monitor.monitorId}:${monitor.workspaceId}`;
          if (this.monitors.has(monitorCacheId)) {
            continue;
          }

          await this.loadMonitorData(
            monitor.monitorId,
            monitor.workspaceId,
            monitor
          );
        }
      }
    } else {
      const monitorIds = getMonitorIds(statusPage);

      if (monitorIds && monitorIds.length > 0) {
        for (const monitorId of monitorIds) {
          const monitorCacheId = `${monitorId}:${statusPage.workspaceId}`;
          if (this.monitors.has(monitorCacheId)) {
            continue;
          }

          await this.loadMonitorData(monitorId, statusPage.workspaceId);
        }
      }
    }

    const statusPageId = `${statusPage.statusId}:${statusPage.workspaceId}`;

    this.statusPages.set(statusPageId, {
      ...statusPage,
      lastUpdated: new Date().toISOString(),
    });
  }

  async addNewStatusPage(statusPage: any) {
    if (hasAutoAdd(statusPage)) {
      const allMonitors = await fetchAllMonitors();

      if (allMonitors && allMonitors.length > 0) {
        for (const monitor of allMonitors) {
          const monitorCacheId = `${monitor.monitorId}:${monitor.workspaceId}`;
          if (this.monitors.has(monitorCacheId)) {
            continue;
          }

          await this.loadMonitorData(
            monitor.monitorId,
            monitor.workspaceId,
            monitor
          );
        }
      }
    } else {
      const monitorIds = getMonitorIds(statusPage);

      if (monitorIds && monitorIds.length > 0) {
        for (const monitorId of monitorIds) {
          const monitorCacheId = `${monitorId}:${statusPage.workspaceId}`;
          if (this.monitors.has(monitorCacheId)) {
            continue;
          }

          await this.loadMonitorData(monitorId, statusPage.workspaceId);
        }
      }
    }

    const statusPageId = `${statusPage.statusId}:${statusPage.workspaceId}`;

    this.statusPages.set(statusPageId, {
      ...statusPage,
      lastUpdated: new Date().toISOString(),
    });
  }

  deleteStatusPage(statusId: string, workspaceId: string) {
    const statusPageId = `${statusId}:${workspaceId}`;
    this.statusPages.delete(statusPageId);
  }

  fetchStatusPage(statusId: string, workspaceId: string) {
    const statusPageId = `${statusId}:${workspaceId}`;
    const statusPage = this.statusPages.get(statusPageId);

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
        const monitorCacheId = `${monitorId}:${statusPage.workspaceId}`;

        if (this.monitors.has(monitorCacheId)) {
          return { ...acc, [monitorId]: this.monitors.get(monitorCacheId) };
        }

        return acc;
      }, {});

      const heartbeats = monitorIds.reduce((acc, monitorId) => {
        const monitorCacheId = `${monitorId}:${statusPage.workspaceId}`;
        if (this.heartbeats.has(monitorCacheId)) {
          return { ...acc, [monitorId]: this.heartbeats.get(monitorCacheId) };
        }

        return acc;
      }, {});

      const incidents =
        this.incidents
          ?.toJSONValues()
          ?.filter((incident) =>
            incident.monitorIds.some((id: string) => monitorIds.includes(id))
          ) || [];

      return { ...statusPage, monitors, incidents, heartbeats };
    }
  }

  addIncident(incident: any) {
    const incidentCacheId = `${incident.incidentId}:${incident.workspaceId}`;
    this.incidents.set(incidentCacheId, incident);
  }

  deleteIncident(incidentId: string, workspaceId: string) {
    const incidentCacheId = `${incidentId}:${workspaceId}`;
    this.incidents.delete(incidentCacheId);
  }

  removeMonitor(monitorId: string, workspaceId: string) {
    const monitorCacheId = `${monitorId}:${workspaceId}`;
    this.monitors.delete(monitorCacheId);
    this.heartbeats.delete(monitorCacheId);
  }

  async reloadMonitor(monitorId: string, workspaceId: string) {
    const monitor = await fetchMonitor(monitorId, workspaceId).catch(
      () => false
    );

    if (!monitor) {
      return;
    }

    const monitorCacheId = `${monitorId}:${workspaceId}`;
    this.monitors.set(monitorCacheId, cleanMonitorForStatusPage(monitor));
  }
}

const statusCache = new Status();
export default statusCache;
