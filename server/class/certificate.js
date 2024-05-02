const parseJson = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return '';
  }
};

const cleanCertificate = (certificate) => ({
  isValid: certificate.isValid,
  issuer: parseJson(certificate.issuer),
  validFrom: certificate.validFrom,
  validTill: certificate.validTill,
  validOn: parseJson(certificate.validOn),
  daysRemaining: certificate.daysRemaining,
  lastCheck: certificate.lastCheck,
  nextCheck: certificate.nextCheck,
});

export default cleanCertificate;
