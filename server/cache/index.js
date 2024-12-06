// import local files
import getCertInfo from '../tools/checkCertificate.js';
import httpStatusCheck from '../tools/httpStatus.js';
import tcpStatusCheck from '../tools/tcpPing.js';
import Collection from '../../shared/utils/collection.js';
import NotificationServices from '../notifications/index.js';
import logger from '../utils/logger.js';
import { fetchMonitor, fetchMonitors } from '../database/queries/monitor.js';
import {
  createHeartbeat,
  deleteHeartbeats,
  fetchHeartbeats,
} from '../database/queries/heartbeat.js';
import {
  deleteCertificate,
  fetchCertificate,
  updateCertificate,
} from '../database/queries/certificate.js';
import { fetchNotificationById } from '../database/queries/notification.js';

class Master {
  constructor() {
    this.timeouts = new Collection();
  }

  async initialise() {
    const monitors = await fetchMonitors();

    for (const monitor of monitors) {
      await this.checkStatus(monitor.monitorId);
    }
  }

  async updateTcpStatus(monitor, heartbeat) {
    const [lastHeartbeat] = await fetchHeartbeats(monitor.monitorId, 1);
    await createHeartbeat(heartbeat);

    clearTimeout(this.timeouts.get(monitor.monitorId));

    await this.sendNotification(monitor, heartbeat, lastHeartbeat);

    const timeout = heartbeat.isDown ? monitor.retryInterval : monitor.interval;

    this.timeouts.set(
      monitor.monitorId,
      setTimeout(() => this.checkStatus(monitor.monitorId), timeout * 1000)
    );
  }

  async checkStatus(monitorId) {
    const monitor = await fetchMonitor(monitorId).catch(() => false);

    if (!monitor) {
      clearTimeout(this.timeouts.get(monitorId));
      this.timeouts.delete(monitorId);
      await deleteCertificate(monitorId);
      await deleteHeartbeats(monitorId);
      return;
    }

    if (this.timeouts.has(monitorId)) {
      clearTimeout(this.timeouts.get(monitorId));
    }

    if (monitor.type === 'http') {
      const [lastHeartbeat] = await fetchHeartbeats(monitorId, 1);
      const heartbeat = await httpStatusCheck(monitor);
      await createHeartbeat(heartbeat);

      if (monitor.url?.toLowerCase().startsWith('https')) {
        const certificate = await fetchCertificate(monitorId);

        if (!certificate?.nextCheck || certificate.nextCheck <= Date.now()) {
          const cert = await getCertInfo(monitor.url);
          cert.nextCheck = Date.now() + 600000;
          await updateCertificate(monitorId, cert);
        }
      }

      await this.sendNotification(monitor, heartbeat, lastHeartbeat);

      const timeout = heartbeat.isDown
        ? monitor.retryInterval
        : monitor.interval;

      this.timeouts.set(
        monitorId,
        setTimeout(() => this.checkStatus(monitorId), timeout * 1000)
      );
    }

    if (monitor.type === 'tcp') {
      const updateHeartbeat = (monitor, heartbeat) =>
        this.updateTcpStatus(monitor, heartbeat);
      tcpStatusCheck(monitor, updateHeartbeat);
      clearTimeout(this.timeouts.get(monitorId));
    }
  }

  async sendNotification(monitor, heartbeat, lastHeartbeat) {
    try {
      if (!lastHeartbeat) return;

      const notifyOutage =
        monitor.notificationType === 'All' ||
        monitor.notificationType === 'Outage';

      const notifyRecovery =
        monitor.notificationType === 'All' ||
        monitor.notificationType === 'Recovery';

      const hasOutage =
        notifyOutage && !lastHeartbeat?.isDown && heartbeat.isDown;

      const hasRecovered =
        notifyRecovery && lastHeartbeat?.isDown && !heartbeat.isDown;

      if (!hasOutage && !hasRecovered) return;
      if (!monitor.notificationId) return;

      const notification = await fetchNotificationById(monitor.notificationId);

      if (
        !notification?.isEnabled ||
        !NotificationServices[notification.platform]
      ) {
        return;
      }

      const ServiceClass = NotificationServices[notification.platform];

      if (!ServiceClass) return;

      const service = new ServiceClass();

      if (notifyOutage) {
        await service.send(notification, monitor, heartbeat);
      } else {
        await service.sendRecovery(notification, monitor, heartbeat);
      }
    } catch (error) {
      logger.error('Notification - sendNotification', {
        error: error.message,
        stack: error.stack,
      });
    }
  }
}

const cache = new Master();

export default cache;
