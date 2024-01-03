const checkCertificate = (res) => {
  if (!res.request.res.socket) {
    throw new Error('Socket not found');
  }

  const info = res.request.res.socket.getPeerCertificate(true);
  const valid = res.request.res.socket.authorized || false;

  const parsedInfo = parseCert(info);

  return {
    valid: valid,
    certInfo: parsedInfo,
  };
};

const parseCert = (cert) => {
  const parsedInfo = {
    issuer: cert.issuer,
    subject: cert.subject,
    valid_from: cert.valid_from,
    valid_to: cert.valid_to,
    fingerprint: cert.fingerprint,
    serialNumber: cert.serialNumber,
    raw: cert.raw,
  };

  return parsedInfo;
};

module.exports = {
  checkCertificate,
};
