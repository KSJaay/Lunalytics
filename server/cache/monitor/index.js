import { cleanMonitor } from '../../class/monitor/index.js';
import {
  deleteCertificate,
  fetchCertificate,
  updateCertificate,
} from '../../database/queries/certificate.js';
import {
  createHeartbeat,
  deleteHeartbeats,
  fetchHeartbeats,
  isMonitorDown,
  isMonitorRecovered,
} from '../../database/queries/heartbeat.js';
import {
  fetchAllMonitors,
  fetchMonitor,
} from '../../database/queries/monitor.js';
import logger from '../../utils/logger.js';
import getCertInfo from '../../tools/checkCertificate.js';
import dockerStatusCheck from '../../tools/docker.js';
import httpStatusCheck from '../../tools/httpStatus.js';
import pingStatusCheck from '../../tools/icmpPing.js';
import jsonStatusCheck from '../../tools/jsonStatus.js';
import pushStatusCheck from '../../tools/push.js';
import tcpStatusCheck from '../../tools/tcpPing.js';
import sendMonitorNotification from './notification.js';
import Collection from '../../../shared/utils/collection.js';

class MonitorCache {
  constructor() {
    this.timeouts = new Collection();
  }

  async initialise() {
    const monitors = await fetchAllMonitors();

    for (const monitor of monitors) {
      await this.checkMonitorStatus(monitor.monitorId, monitor.workspaceId);
    }
  }

  async updateTimeout(monitor, heartbeat) {
    await createHeartbeat(heartbeat);

    const isDown = await isMonitorDown(
      monitor.monitorId,
      monitor.workspaceId,
      monitor.retry
    );

    if (isDown) {
      await sendMonitorNotification(monitor, heartbeat, isDown, false);
    }

    if (!isDown) {
      const hasRecovered = await isMonitorRecovered(
        monitor.monitorId,
        monitor.workspaceId,
        monitor.retry
      );

      if (hasRecovered) {
        await sendMonitorNotification(monitor, heartbeat, false, hasRecovered);
      }
    }

    const timeout = heartbeat.isDown ? monitor.retryInterval : monitor.interval;

    this.timeouts.set(
      monitor.monitorId,
      setTimeout(
        () => this.checkMonitorStatus(monitor.monitorId, monitor.workspaceId),
        timeout * 1000
      )
    );
  }

  async checkCertificate(monitor) {
    try {
      if (monitor.url?.toLowerCase().startsWith('https')) {
        const certificate = await fetchCertificate(
          monitor.monitorId,
          monitor.workspaceId
        );

        const certDate = new Date(certificate?.nextCheck);
        if (!certificate?.nextCheck || certDate.getTime() <= Date.now()) {
          const cert = await getCertInfo(monitor.url);
          cert.nextCheck = new Date(Date.now() + 600000).toISOString();
          await updateCertificate(monitor.monitorId, monitor.workspaceId, cert);
        }
      }
    } catch (error) {
      logger.error('Check Certificate', {
        message: `Issue checking certificate for monitor ${monitor.monitorId}: ${error.message}`,
      });
    }
  }

  async checkMonitorStatus(monitorId, workspaceId) {
    const query = await fetchMonitor(monitorId, workspaceId).catch(() => false);

    if (!query) {
      clearTimeout(this.timeouts.get(monitorId));
      this.timeouts.delete(monitorId);
      await deleteCertificate(monitorId, workspaceId);
      await deleteHeartbeats(monitorId, workspaceId);
      return;
    }

    const monitor = cleanMonitor(query, false, false);

    if (monitor.paused) {
      if (this.timeouts.has(monitorId)) {
        clearTimeout(this.timeouts.get(monitorId));
      }

      return;
    }

    if (this.timeouts.has(monitorId)) {
      clearTimeout(this.timeouts.get(monitorId));
    }

    switch (monitor.type) {
      case 'docker': {
        const heartbeat = await dockerStatusCheck(monitor);
        await this.updateTimeout(monitor, heartbeat);
        break;
      }

      case 'http': {
        const heartbeat = await httpStatusCheck(monitor);
        await this.checkCertificate(monitor);
        await this.updateTimeout(monitor, heartbeat);
        break;
      }

      case 'json': {
        const heartbeat = await jsonStatusCheck(monitor);
        await this.checkCertificate(monitor);
        await this.updateTimeout(monitor, heartbeat);
        break;
      }

      case 'ping': {
        const heartbeat = await pingStatusCheck(monitor);
        await this.updateTimeout(monitor, heartbeat);
        break;
      }

      case 'push': {
        const heartbeat = await pushStatusCheck(monitor);

        if (!heartbeat) {
          const hasRecovered = await isMonitorRecovered(
            monitor.monitorId,
            monitor.retry
          );

          if (hasRecovered) {
            const lastHeartbeat = await fetchHeartbeats(
              monitor.monitorId,
              monitor.workspaceId,
              1
            );

            await sendMonitorNotification(
              monitor,
              {
                monitorId: monitor.monitorId,
                workspaceId: monitor.workspaceId,
                status: lastHeartbeat[0]?.status || 'RUNNING',
                latency: lastHeartbeat[0]?.latency || 0,
                message:
                  lastHeartbeat[0]?.message || 'PUSH notification received',
                isDown: false,
              },
              false,
              hasRecovered
            );
          }

          this.timeouts.set(
            monitor.monitorId,
            setTimeout(
              () =>
                this.checkMonitorStatus(monitor.monitorId, monitor.workspaceId),
              monitor.interval * 1000
            )
          );

          return;
        }

        await this.updateTimeout(monitor, heartbeat);
        break;
      }

      case 'tcp': {
        const updateHeartbeat = (monitor, heartbeat) =>
          this.updateTimeout(monitor, heartbeat);
        await tcpStatusCheck(monitor, updateHeartbeat);
        break;
      }

      default: {
        break;
      }
    }
  }
}

const cache = new MonitorCache();

export default cache;
