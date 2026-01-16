// import local files
import getCertInfo from '../tools/checkCertificate.js';
import httpStatusCheck from '../tools/httpStatus.js';
import tcpStatusCheck from '../tools/tcpPing.js';
import Collection from '../../shared/utils/collection.js';
import NotificationServices from '../notifications/index.js';
import logger from '../utils/logger.js';
import { fetchAllMonitors, fetchMonitor } from '../database/queries/monitor.js';
import {
  createHeartbeat,
  deleteHeartbeats,
  isMonitorDown,
  isMonitorRecovered,
} from '../database/queries/heartbeat.js';
import {
  deleteCertificate,
  fetchCertificate,
  updateCertificate,
} from '../database/queries/certificate.js';
import { fetchNotificationById } from '../database/queries/notification.js';
import pingStatusCheck from '../tools/icmpPing.js';
import jsonStatusCheck from '../tools/jsonStatus.js';
import { cleanMonitor } from '../class/monitor/index.js';
import dockerStatusCheck from '../tools/docker.js';
import pushStatusCheck from '../tools/push.js';

class Master {
  constructor() {
    this.timeouts = new Collection();
  }

  async initialise() {
    const monitors = await fetchAllMonitors();

    for (const monitor of monitors) {
      await this.checkStatus(monitor.monitorId, monitor.workspaceId);
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
      await this.sendNotification(monitor, heartbeat, isDown, false);
    }

    if (!isDown) {
      const hasRecovered = await isMonitorRecovered(
        monitor.monitorId,
        monitor.workspaceId,
        monitor.retry
      );

      if (hasRecovered) {
        await this.sendNotification(monitor, heartbeat, false, hasRecovered);
      }
    }

    const timeout = heartbeat.isDown ? monitor.retryInterval : monitor.interval;

    this.timeouts.set(
      monitor.monitorId,
      setTimeout(
        () => this.checkStatus(monitor.monitorId, monitor.workspaceId),
        timeout * 1000
      )
    );
  }

  async checkStatus(monitorId, workspaceId) {
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

    if (monitor.type === 'http') {
      const heartbeat = await httpStatusCheck(monitor);

      if (monitor.url?.toLowerCase().startsWith('https')) {
        const certificate = await fetchCertificate(monitorId, workspaceId);

        const certDate = new Date(certificate?.nextCheck);
        if (!certificate?.nextCheck || certDate.getTime() <= Date.now()) {
          const cert = await getCertInfo(monitor.url);
          cert.nextCheck = new Date(Date.now() + 600000).toISOString();
          await updateCertificate(monitorId, workspaceId, cert);
        }
      }

      await this.updateTimeout(monitor, heartbeat);
    }

    if (monitor.type === 'docker') {
      const heartbeat = await dockerStatusCheck(monitor);
      await this.updateTimeout(monitor, heartbeat);
    }

    if (monitor.type === 'tcp') {
      const updateHeartbeat = (monitor, heartbeat) =>
        this.updateTimeout(monitor, heartbeat);
      await tcpStatusCheck(monitor, updateHeartbeat);
    }

    if (monitor.type === 'push') {
      const heartbeat = await pushStatusCheck(monitor);

      if (!heartbeat) {
        const hasRecovered = await isMonitorRecovered(
          monitor.monitorId,
          monitor.workspaceId,
          monitor.retry
        );

        if (hasRecovered) {
          await this.sendNotification(
            monitor,
            {
              monitorId: monitor.monitorId,
              workspaceId: monitor.workspaceId,
              status: 'RUNNING',
              latency: 0,
              message: 'PUSH notification received',
              isDown: false,
            },
            false,
            hasRecovered
          );
        }

        this.timeouts.set(
          monitor.monitorId,
          setTimeout(
            () => this.checkStatus(monitor.monitorId, monitor.workspaceId),
            monitor.interval * 1000
          )
        );

        return;
      }

      await this.updateTimeout(monitor, heartbeat);
    }

    if (monitor.type === 'ping') {
      const heartbeat = await pingStatusCheck(monitor);
      await this.updateTimeout(monitor, heartbeat);
    }

    if (monitor.type === 'json') {
      const heartbeat = await jsonStatusCheck(monitor);

      if (monitor.url?.toLowerCase().startsWith('https')) {
        const certificate = await fetchCertificate(monitorId, workspaceId);

        const certDate = new Date(certificate?.nextCheck);
        if (!certificate?.nextCheck || certDate.getTime() <= Date.now()) {
          const cert = await getCertInfo(monitor.url);
          cert.nextCheck = new Date(Date.now() + 600000).toISOString();
          await updateCertificate(monitorId, workspaceId, cert);
        }
      }

      await this.updateTimeout(monitor, heartbeat);
    }
  }

  async sendNotification(monitor, heartbeat, isDown, isRecovered) {
    try {
      if (!isDown && !isRecovered) return;

      const notifyOutage =
        monitor.notificationType === 'All' ||
        monitor.notificationType === 'Outage';

      const notifyRecovery =
        monitor.notificationType === 'All' ||
        monitor.notificationType === 'Recovery';

      const hasOutage = notifyOutage && isDown;

      const hasRecovered = notifyRecovery && isRecovered;

      if (!hasOutage && !hasRecovered) return;
      if (!monitor.notificationId) return;

      if (hasOutage && monitor.parentId) {
        const parentMonitor = await fetchMonitor(
          monitor.parentId,
          monitor.workspaceId
        ).catch(() => false);

        if (parentMonitor) {
          const isDown = await isMonitorDown(
            parentMonitor.monitorId,
            parentMonitor.workspaceId,
            parentMonitor.retry
          );

          if (isDown) return;
        }
      }

      const notification = await fetchNotificationById(
        monitor.notificationId,
        monitor.workspaceId
      );

      if (
        !notification?.isEnabled ||
        !NotificationServices[notification.platform]
      ) {
        return;
      }

      const ServiceClass = NotificationServices[notification.platform];

      if (!ServiceClass) return;

      const service = new ServiceClass();

      if (hasOutage) {
        await service.send(notification, monitor, heartbeat);
      }

      if (hasRecovered) {
        await service.sendRecovery(notification, monitor, heartbeat);
      }
    } catch (error) {
      logger.error('Notification - sendNotification', {
        error: error.message,
        stack: error.stack,
      });
    }
  }

  removeMonitor(monitorId) {
    clearTimeout(this.timeouts.get(monitorId));
    this.timeouts.delete(monitorId);
  }
}

const cache = new Master();

export default cache;
