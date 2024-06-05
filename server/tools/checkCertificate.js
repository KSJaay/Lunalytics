import https from 'https';
import axios from 'axios';
import logger from '../utils/logger.js';

const getCertInfo = async (url) => {
  try {
    const response = await axios.request({
      url,
      method: 'HEAD',
      port: 443,
      httpAgent: new https.Agent({
        enableTrace: true,
      }),
    });

    return checkCertificate(response);
  } catch (error) {
    logger.error('getCertInfo', error);

    return { isValid: false };
  }
};

const checkCertificate = (res) => {
  if (!res.request.socket) {
    logger.error('checkCertificate', 'Socket not found');
    return { isValid: false };
  }

  const info = res.request.socket.getPeerCertificate(true);
  const valid = res.request.socket.authorized || false;

  const parsedInfo = parseCert(info);

  return { isValid: valid, ...parsedInfo };
};

const getDaysBetween = (validFrom, validTo) =>
  Math.round(Math.abs(+validFrom - +validTo) / 8.64e7);

const getDaysRemaining = (validFrom, validTo) => {
  const daysRemaining = getDaysBetween(validFrom, validTo);
  if (new Date(validTo).getTime() < new Date().getTime()) {
    return -daysRemaining;
  }
  return daysRemaining;
};

const parseCert = (cert) => {
  const validOn = cert.subjectaltname
    ?.replace(/DNS:|IP Address:/g, '')
    .split(', ');

  const validTo = new Date(cert.valid_to);
  const daysRemaining = getDaysRemaining(new Date(), validTo);

  const parsedInfo = {
    issuer: JSON.stringify(cert.issuer),
    validFrom: cert.valid_from,
    validTill: cert.valid_to,
    validOn: JSON.stringify(validOn),
    daysRemaining,
  };

  return parsedInfo;
};

export default getCertInfo;
