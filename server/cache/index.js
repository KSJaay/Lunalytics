// import classes
const Certificates = require('./certificates');
const Heartbeats = require('./heartbeats');
const Monitor = require('./monitors');
const getCertInfo = require('../tools/checkCertificate');
const httpStatusCheck = require('../tools/httpStatus');
const tcpStatusCheck = require('../tools/tcpPing');

class Master {
  constructor() {
    this.heartbeats = new Heartbeats();
    this.certificates = new Certificates();
    this.monitors = new Monitor();
    this.timeouts = new Map();
  }

  async initialise() {
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

      if (monitor.url?.startsWith('https://')) {
        const certificate = await this.certificates.get(monitorId);

        if (!certificate?.nextCheck || certificate.nextCheck <= Date.now()) {
          const cert = await getCertInfo(monitor.url);

          if (cert) {
            await this.certificates.update(monitorId, {
              ...certificate,
              ...cert,
            });
          }
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

module.exports = cache;
