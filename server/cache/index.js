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
import { cleanPartialMonitor } from '../class/monitor.js';
import pingStatusCheck from '../tools/icmpPing.js';
import jsonStatusCheck from '../tools/jsonStatus.js';

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

  async checkPingStatus(monitor) {
    const [lastHeartbeat] = await fetchHeartbeats(monitor.monitorId, 1);
    const heartbeat = await pingStatusCheck(monitor);
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
    const query = await fetchMonitor(monitorId).catch(() => false);

    if (!query) {
      clearTimeout(this.timeouts.get(monitorId));
      this.timeouts.delete(monitorId);
      await deleteCertificate(monitorId);
      await deleteHeartbeats(monitorId);
      return;
    }

    const monitor = cleanPartialMonitor(query);

    if (monitor.paused) return;

    if (this.timeouts.has(monitorId)) {
      clearTimeout(this.timeouts.get(monitorId));
    }

    if (monitor.type === 'http') {
      const [lastHeartbeat] = await fetchHeartbeats(monitorId, 1);
      const heartbeat = await httpStatusCheck(monitor);
      await createHeartbeat(heartbeat);

      if (monitor.url?.toLowerCase().startsWith('https')) {
        const certificate = await fetchCertificate(monitorId);

        const certDate = new Date(certificate?.nextCheck);
        if (!certificate?.nextCheck || certDate.getTime() <= Date.now()) {
          const cert = await getCertInfo(monitor.url);
          cert.nextCheck = new Date(Date.now() + 600000).toISOString();
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
      clearTimeout(this.timeouts.get(monitorId));
      const updateHeartbeat = (monitor, heartbeat) =>
        this.updateTcpStatus(monitor, heartbeat);
      tcpStatusCheck(monitor, updateHeartbeat);
    }

    if (monitor.type === 'ping') {
      await this.checkPingStatus(monitor);
    }

    if (monitor.type === 'json') {
      const [lastHeartbeat] = await fetchHeartbeats(monitorId, 1);
      const heartbeat = await jsonStatusCheck(monitor);
      await createHeartbeat(heartbeat);

      if (monitor.url?.toLowerCase().startsWith('https')) {
        const certificate = await fetchCertificate(monitorId);

        const certDate = new Date(certificate?.nextCheck);
        if (!certificate?.nextCheck || certDate.getTime() <= Date.now()) {
          const cert = await getCertInfo(monitor.url);
          cert.nextCheck = new Date(Date.now() + 600000).toISOString();
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
