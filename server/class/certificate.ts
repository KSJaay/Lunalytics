import { parseJsonOrArray } from '../utils/parser.js';

const cleanCertificate = (certificate) => {
  if (!certificate) return { isValid: false };

  if (!certificate?.isValid) return { isValid: false };

  return {
    isValid: certificate.isValid == '1',
    issuer: parseJsonOrArray(certificate.issuer, []),
    validFrom: certificate.validFrom,
    validTill: certificate.validTill,
    validOn: parseJsonOrArray(certificate.validOn, []),
    daysRemaining: certificate.daysRemaining,
    nextCheck: certificate.nextCheck,
  };
};

export default cleanCertificate;
