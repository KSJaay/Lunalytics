import SQLite from '../sqlite/setup.js';

export const fetchCertificate = async (monitorId) => {
  const certificate = await SQLite.client('certificate')
    .where({ monitorId })
    .first();

  if (!certificate) {
    return { isValid: false };
  }

  return certificate;
};

export const updateCertificate = async (monitorId, certificate) => {
  const cert = await SQLite.client('certificate').where({ monitorId }).first();

  if (!cert) {
    await SQLite.client('certificate').insert({ monitorId, ...certificate });
  } else {
    await SQLite.client('certificate').where({ monitorId }).update(certificate);
  }

  return true;
};

export const deleteCertificate = async (monitorId) => {
  await SQLite.client('certificate').where({ monitorId }).del();
};
