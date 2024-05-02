const thirtyDaysInMilliseconds = 2592000000;

const setClientSideCookie = (res, name, value) => {
  return res.cookie(name, value, {
    expires: new Date(Date.now() + thirtyDaysInMilliseconds),
    maxAge: thirtyDaysInMilliseconds,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
};

const setServerSideCookie = (res, name, value) => {
  return res.cookie(name, value, {
    expires: new Date(Date.now() + thirtyDaysInMilliseconds),
    maxAge: thirtyDaysInMilliseconds,
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

export { setClientSideCookie, setServerSideCookie, deleteCookie };
