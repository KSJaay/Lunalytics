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
import dnsStatusCheck from '../../tools/dns.js';
import dockerStatusCheck from '../../tools/docker.js';
import httpStatusCheck from '../../tools/httpStatus.js';
import pingStatusCheck from '../../tools/icmpPing.js';
import jsonStatusCheck from '../../tools/jsonStatus.js';
import pushStatusCheck from '../../tools/push.js';
import tcpStatusCheck from '../../tools/tcpPing.js';
import sendMonitorNotification from './notification.js';
import Collection from '../../../shared/utils/collection.js';
import { MonitorProps } from '../../../shared/types/monitor.js';
import gamedigStatusCheck from '../../tools/gamedig.js';

class MonitorCache {
  timeouts: any;

  constructor() {
    this.timeouts = new Collection();
  }

  async initialise() {
    const monitors = await fetchAllMonitors();

    for (const monitor of monitors) {
      await this.checkMonitorStatus(monitor.monitorId, monitor.workspaceId);
    }
  }

  async updateTimeout(monitor: any, heartbeat: any) {
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

  async checkCertificate(monitor: any) {
    try {
      if (monitor.url?.toLowerCase().startsWith('https')) {
        const certificate = await fetchCertificate(
          monitor.monitorId,
          monitor.workspaceId
        );

        // @ts-ignore
        const certDate = new Date(certificate?.nextCheck || 0);
        // @ts-ignore
        if (!certificate?.nextCheck || certDate.getTime() <= Date.now()) {
          const cert = await getCertInfo(monitor.url);
          const certWithNextCheck = {
            ...cert,
            nextCheck: new Date(Date.now() + 600000).toISOString(),
          };

          await updateCertificate(
            monitor.monitorId,
            monitor.workspaceId,
            certWithNextCheck
          );
        }
      }
    } catch (error: any) {
      logger.error('Check Certificate', {
        message: `Issue checking certificate for monitor ${monitor.monitorId}: ${error.message}`,
        stack: error.stack,
      });
    }
  }

  async checkMonitorStatus(monitorId: any, workspaceId: any) {
    const query = await fetchMonitor(monitorId, workspaceId).catch(() => false);

    const monitorCacheId = `${monitorId}:${workspaceId}`;

    if (!query) {
      clearTimeout(this.timeouts.get(monitorCacheId));
      this.timeouts.delete(monitorCacheId);
      await deleteCertificate(monitorId, workspaceId);
      await deleteHeartbeats(monitorId, workspaceId);
      return;
    }

    const monitor = cleanMonitor(query, false, false) as MonitorProps;

    if (monitor.paused) {
      if (this.timeouts.has(monitorCacheId)) {
        clearTimeout(this.timeouts.get(monitorCacheId));
      }

      return;
    }

    if (this.timeouts.has(monitorCacheId)) {
      clearTimeout(this.timeouts.get(monitorCacheId));
    }

    switch (monitor.type) {
      case 'dns': {
        const heartbeat = await dnsStatusCheck(monitor);
        await this.updateTimeout(monitor, heartbeat);
        break;
      }

      case 'docker': {
        const heartbeat = await dockerStatusCheck(monitor);
        await this.updateTimeout(monitor, heartbeat);
        break;
      }

      case 'gamedig': {
        const heartbeat = await gamedigStatusCheck(monitor);
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
            monitor.workspaceId,
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
                status: lastHeartbeat?.[0]?.status || 'RUNNING',
                latency: lastHeartbeat?.[0]?.latency || 0,
                message:
                  lastHeartbeat?.[0]?.message || 'PUSH notification received',
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
        const updateHeartbeat = (monitor: any, heartbeat: any) =>
          this.updateTimeout(monitor, heartbeat);
        await tcpStatusCheck(monitor, updateHeartbeat);
        break;
      }

      default: {
        break;
      }
    }
  }

  removeMonitor(monitorId: string, workspaceId: string) {
    const monitorCacheId = `${monitorId}:${workspaceId}`;

    if (this.timeouts.has(monitorCacheId)) {
      clearTimeout(this.timeouts.get(monitorCacheId));
      this.timeouts.delete(monitorCacheId);
    }
  }
}

const cache = new MonitorCache();

export default cache;
