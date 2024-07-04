import cleanCertificate from '../class/certificate.js';
import {
  fetchCertificate,
  updateCertificate,
  deleteCertificate,
} from '../database/queries/certificate.js';

class Certificates {
  constructor() {
    this.certificates = new Map();
  }

  async get(monitorId) {
    const certificate = this.certificates.get(monitorId);

    if (certificate) {
      return certificate;
    }

    const query = await fetchCertificate(monitorId);

    this.certificates.set(monitorId, cleanCertificate(query));

    return query;
  }

  async update(monitorId, certificate) {
    delete certificate.lastCheck;
    delete certificate.nextCheck;

    await updateCertificate(monitorId, certificate);

    certificate.lastCheck = Date.now();
    certificate.nextCheck = certificate.lastCheck + 86400000;

    this.certificates.set(monitorId, cleanCertificate(certificate));
  }

  async delete(monitorId) {
    await deleteCertificate(monitorId);
    this.certificates.delete(monitorId);
  }
}

export default Certificates;
