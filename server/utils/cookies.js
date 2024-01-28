const thirtyDaysInMilliseconds = 2592000000;

const setClientSideCookie = (res, name, value) => {
  return res.cookie(name, value, {
    expires: new Date(Date.now() + thirtyDaysInMilliseconds),
    maxAge: thirtyDaysInMilliseconds,
    secure: process.env.NODE_ENV === 'production',
    domain: process.env.APP_HOST || 'localhost',
    sameSite: 'strict',
  });
};

const setServerSideCookie = (res, name, value) => {
  return res.cookie(name, value, {
    expires: new Date(Date.now() + thirtyDaysInMilliseconds),
    maxAge: thirtyDaysInMilliseconds,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    domain: process.env.APP_HOST || 'localhost',
    sameSite: 'strict',
  });
};

const deleteCookie = (res, name) => {
  return res.cookie(name, '', {
    domain: process.env.APP_HOST || 'localhost',
    expires: -1,
    maxAge: -1,
  });
};

module.exports = {
  setClientSideCookie,
  setServerSideCookie,
  deleteCookie,
};
