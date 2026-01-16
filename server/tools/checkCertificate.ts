import https from 'https';
import { IncomingMessage } from 'http';
import logger from '../utils/logger.js';
import { isEmpty } from '../../shared/utils/object.js';

// Some of the following code is from https://github.com/johncrisostomo/get-ssl-certificate

interface CertInfo {
  isValid: boolean;
  issuer?: string;
  validFrom?: string;
  validTill?: string;
  validOn?: string;
  daysRemaining?: number;
}

interface FetchOptions {
  hostname: string;
  agent: boolean;
  rejectUnauthorized: boolean;
  ciphers: string;
  port: number | string;
  protocol: string;
}

const getOptions = (
  url: string,
  port: number | string,
  protocol: string
): FetchOptions => {
  const parseUrl = url.startsWith('http')
    ? new URL(url)
    : new URL(`http://${url}`);

  if (parseUrl.protocol === 'https:') {
    port = parseUrl.port || 443;
  } else {
    port = parseUrl.port || 80;
  }

  return {
    hostname: parseUrl.hostname,
    agent: false,
    rejectUnauthorized: false,
    ciphers: 'ALL',
    port,
    protocol,
  };
};

const handleRequest = (
  options: FetchOptions,
  detailed: boolean = false,
  resolve: (value: unknown) => void,
  reject: (reason?: any) => void
) => {
  return https.get(options, function (res: IncomingMessage) {
    let certificate = res.socket.getPeerCertificate(detailed);

    if (isEmpty(certificate) || certificate === null) {
      reject({ message: 'The website did not provide a certificate' });
    } else {
      resolve(certificate);
    }
  });
};

const fetchCertificate = (
  url: string,
  timeout: number,
  port: number | string = 443,
  protocol: string = 'https:',
  detailed: boolean = false
) => {
  let options = getOptions(url, port, protocol);

  return new Promise(function (resolve, reject) {
    let req = handleRequest(options, detailed, resolve, reject);

    if (timeout) {
      req.setTimeout(timeout, function () {
        reject({ message: 'Request timed out.' });
        req.destroy();
      });
    }

    req.on('error', function (e) {
      reject(e);
    });

    req.end();
  });
};

const getCertInfo = async (url: string) => {
  try {
    const certificate = await fetchCertificate(url, 5000);
    return { isValid: true, ...parseCert(certificate) };
  } catch (error: any) {
    logger.error('getCertInfo', {
      error: error.message,
      stack: error.stack,
    });

    return { isValid: false };
  }
};

const getDaysBetween = (validFrom: Date, validTo: Date) =>
  Math.round(Math.abs(+validFrom - +validTo) / 8.64e7);

const getDaysRemaining = (validFrom: Date, validTo: Date) => {
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
