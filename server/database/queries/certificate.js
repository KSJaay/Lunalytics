const SQLite = require('../sqlite/setup');

const fetchCertificate = async (monitorId) => {
  const certificate = await SQLite.client('certificate')
    .where({ monitorId })
    .first();

  if (!certificate) {
    return { isValid: false };
  }

  return certificate;
};

const updateCertificate = async (monitorId, certificate) => {
  const cert = await SQLite.client('certificate').where({ monitorId }).first();

  if (!cert) {
    await SQLite.client('certificate').insert({ monitorId, ...certificate });
  } else {
    await SQLite.client('certificate')
      .where({ monitorId })
      .update({ ...certificate });
  }

  return true;
};

module.exports = { fetchCertificate, updateCertificate };
