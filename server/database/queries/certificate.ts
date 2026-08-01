import cleanCertificate from '../../class/certificate.js';
import database from '../connection.js';

export const fetchCertificate = async (
  monitorId: string,
  workspaceId: string
) => {
  const client = await database.connect();

  const certificate = await client?.('certificate')
    .where({ monitorId, workspaceId })
    .first();

  if (!certificate) {
    return { isValid: false };
  }

  return cleanCertificate(certificate);
};

export const updateCertificate = async (
  monitorId: string,
  workspaceId: string,
  certificate: any
) => {
  const client = await database.connect();

  const cert = await client?.('certificate')
    .where({ monitorId, workspaceId })
    .first();

  if (!cert) {
    await client?.('certificate').insert({
      monitorId,
      workspaceId,
      ...certificate,
    });
  } else {
    await client?.('certificate')
      .where({ monitorId, workspaceId })
      .update(certificate);
  }

  return true;
};

export const deleteCertificate = async (
  monitorId: string,
  workspaceId: string
) => {
  const client = await database.connect();
  await client?.('certificate').where({ monitorId, workspaceId }).del();
};
