const nintyDaysInMilliseconds = 2592000000 * 3;

const setClientSideCookie = (res, name, value) => {
  return res.cookie(name, value, {
    expires: new Date(Date.now() + nintyDaysInMilliseconds),
    maxAge: nintyDaysInMilliseconds,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
};

const setServerSideCookie = (res, name, value) => {
  return res.cookie(name, value, {
    expires: new Date(Date.now() + nintyDaysInMilliseconds),
    maxAge: nintyDaysInMilliseconds,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
  });
};

const setDemoCookie = (res, name, value) => {
  return res.cookie(name, value, {
    secure: process.env.NODE_ENV === 'production',
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
