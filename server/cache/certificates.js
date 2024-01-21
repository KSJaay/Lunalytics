const {
  fetchCertificate,
  updateCertificate,
  deleteCertificate,
} = require('../database/queries/certificate');

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

    this.certificates.set(monitorId, query);

    return query;
  }

  async update(monitorId, certificate) {
    if (certificate?.nextCheck) {
      delete certificate.nextCheck;
    }

    await updateCertificate(monitorId, certificate);

    certificate.nextCheck = Date.now() + 86400000;

    this.certificates.set(monitorId, certificate);
  }

  async delete(monitorId) {
    await deleteCertificate(monitorId);
    this.certificates.delete(monitorId);
  }
}

module.exports = Certificates;
