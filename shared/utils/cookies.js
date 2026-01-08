const nintyDaysInMilliseconds = 2592000000 * 3;

const isProduction = process.env?.NODE_ENV === 'production';

const setClientSideCookie = (res, name, value) => {
  return res.cookie(name, value, {
    expires: new Date(Date.now() + nintyDaysInMilliseconds),
    maxAge: nintyDaysInMilliseconds,
    secure: isProduction,
    sameSite: 'strict',
  });
};

const setServerSideCookie = (
  res,
  name,
  value,
  isHttps = true,
  sameSite = 'strict'
) => {
  if (!isHttps) {
    return res.cookie(name, value, {
      expires: new Date(Date.now() + nintyDaysInMilliseconds),
      maxAge: nintyDaysInMilliseconds,
      httpOnly: true,
      sameSite,
    });
  }

  return res.cookie(name, value, {
    expires: new Date(Date.now() + nintyDaysInMilliseconds),
    maxAge: nintyDaysInMilliseconds,
    secure: isProduction,
    httpOnly: true,
    sameSite,
  });
};

const setDemoCookie = (res, name, value) => {
  return res.cookie(name, value, {
    secure: isProduction,
    httpOnly: true,
    sameSite: 'strict',
  });
};

const deleteCookie = (res, name) => {
  return res.cookie(name, '', {
    expires: -1,
    maxAge: -1,
  });
};

export {
  setClientSideCookie,
  setServerSideCookie,
  setDemoCookie,
  deleteCookie,
};
