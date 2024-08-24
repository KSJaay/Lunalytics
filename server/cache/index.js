// import classes
import Certificates from './certificates.js';
import Heartbeats from './heartbeats.js';
import Monitor from './monitors.js';
import Notifications from './notifications.js';
import getCertInfo from '../tools/checkCertificate.js';
import httpStatusCheck from '../tools/httpStatus.js';
import tcpStatusCheck from '../tools/tcpPing.js';
import Collection from '../../shared/utils/collection.js';

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

  async setTimeout(monitorId, interval = 30) {
    if (this.timeouts.has(monitorId)) {
      clearTimeout(this.timeouts.get(monitorId));
    }

    await this.checkStatus(monitorId);

    this.timeouts.set(
      monitorId,
      setTimeout(() => this.checkStatus(monitorId), interval * 1000)
    );
  }

  async updateTcpStatus(monitor, heartbeat) {
    await this.heartbeats.addHeartbeat(heartbeat);

    clearTimeout(this.timeouts.get(monitor.monitorId));

    monitor.lastCheck = Date.now();
    monitor.nextCheck = monitor.lastCheck + monitor.interval * 1000;
    await this.monitors.updateUptimePercentage(monitor);

    this.timeouts.set(
      monitor.monitorId,
      setTimeout(
        () => this.checkStatus(monitor.monitorId),
        monitor.interval * 1000
      )
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

    if (monitor.type === 'http') {
      const heartbeat = await httpStatusCheck(monitor);
      await this.heartbeats.addHeartbeat(heartbeat);

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

      this.timeouts.set(
        monitorId,
        setTimeout(() => this.checkStatus(monitorId), monitor.interval * 1000)
      );
    }

    if (monitor.type === 'tcp') {
      const updateHeartbeat = (monitor, heartbeat) =>
        this.updateTcpStatus(monitor, heartbeat);
      tcpStatusCheck(monitor, updateHeartbeat);
      clearTimeout(this.timeouts.get(monitorId));
    }
  }
}

const cache = new Master();

export default cache;
