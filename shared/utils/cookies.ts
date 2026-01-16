const nintyDaysInMilliseconds = 2592000000 * 3;

const isProduction = process.env?.NODE_ENV === 'production';

import type { Response } from 'express';

const setClientSideCookie = (
  res: Response,
  name: string,
  value: string
): Response => {
  return res.cookie(name, value, {
    expires: new Date(Date.now() + nintyDaysInMilliseconds),
    maxAge: nintyDaysInMilliseconds,
    secure: isProduction,
    sameSite: 'strict',
  });
};

const setServerSideCookie = (
  res: Response,
  name: string,
  value: string,
  isHttps: boolean = true,
  sameSite: 'strict' | 'lax' | 'none' = 'strict'
): Response => {
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

const setDemoCookie = (
  res: Response,
  name: string,
  value: string
): Response => {
  return res.cookie(name, value, {
    secure: isProduction,
    httpOnly: true,
    sameSite: 'strict',
  });
};

const deleteCookie = (res: Response, name: string): Response => {
  return res.cookie(name, '', {
    expires: new Date(0),
    maxAge: -1,
  });
};

export {
  setClientSideCookie,
  setServerSideCookie,
  setDemoCookie,
  deleteCookie,
};
