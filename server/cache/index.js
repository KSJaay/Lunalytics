// import classes
import Certificates from './certificates.js';
import Heartbeats from './heartbeats.js';
import Monitor from './monitors.js';
import Notifications from './notifications.js';
import getCertInfo from '../tools/checkCertificate.js';
import httpStatusCheck from '../tools/httpStatus.js';
import tcpStatusCheck from '../tools/tcpPing.js';
import Collection from '../../shared/utils/collection.js';
import NotificationServices from '../notifications/index.js';

class Master {
  constructor() {
    this.heartbeats = new Heartbeats();
    this.certificates = new Certificates();
    this.monitors = new Monitor();
    this.notifications = new Notifications();
    this.timeouts = new Collection();
  }

  async initialise() {
    await this.notifications.getAll();
    const monitors = await this.monitors.getAll();

    for (const monitor of monitors) {
      await this.certificates.get(monitor.monitorId);
      await this.heartbeats.get(monitor.monitorId);
      await this.checkStatus(monitor.monitorId);
    }
  }

  async updateTcpStatus(monitor, heartbeat) {
    const [lastHeartbeat] = await this.heartbeats.getLastHeartbeat(
      monitor.monitorId
    );
    await this.heartbeats.addHeartbeat(monitor.monitorId, heartbeat);

    clearTimeout(this.timeouts.get(monitor.monitorId));

    monitor.lastCheck = Date.now();
    monitor.nextCheck = monitor.lastCheck + monitor.interval * 1000;
    await this.monitors.updateUptimePercentage(monitor);

    await this.sendNotification(monitor, heartbeat, lastHeartbeat);

    const timeout = heartbeat.isDown ? monitor.retryInterval : monitor.interval;

    this.timeouts.set(
      monitor.monitorId,
      setTimeout(() => this.checkStatus(monitor.monitorId), timeout * 1000)
    );
  }

  async checkStatus(monitorId) {
    const monitor = await this.monitors.get(monitorId).catch(() => false);

    if (!monitor) {
      clearTimeout(this.timeouts.get(monitorId));
      this.timeouts.delete(monitorId);
      await this.certificates.delete(monitorId);
      await this.heartbeats.delete(monitorId);
      return;
    }

    if (this.timeouts.has(monitorId)) {
      clearTimeout(this.timeouts.get(monitorId));
    }

    if (monitor.type === 'http') {
      const [lastHeartbeat] = await this.heartbeats.getLastHeartbeat(monitorId);
      const heartbeat = await httpStatusCheck(monitor);
      await this.heartbeats.addHeartbeat(monitorId, heartbeat);

      if (monitor.url?.toLowerCase().startsWith('https')) {
        const certificate = await this.certificates.get(monitorId);

        if (!certificate?.nextCheck || certificate.nextCheck <= Date.now()) {
          const cert = await getCertInfo(monitor.url);
          await this.certificates.update(monitorId, cert);
        }
      }

      monitor.lastCheck = Date.now();
      monitor.nextCheck = monitor.lastCheck + monitor.interval * 1000;
      await this.monitors.updateUptimePercentage(monitor);

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

      const notification = await this.notifications.getById(
        monitor.notificationId
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

      if (notifyOutage) {
        await service.send(notification, monitor, heartbeat);
      } else {
        await service.sendRecovery(notification, monitor, heartbeat);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const cache = new Master();

export default cache;
