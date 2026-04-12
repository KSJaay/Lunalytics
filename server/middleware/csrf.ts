import crypto from 'crypto';
import type { NextFunction, Request, Response } from 'express';

const CSRF_COOKIE = 'csrf_token';
const CSRF_HEADER = 'x-csrf-token';

const generateCsrfToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

const csrfProtection = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    if (!request.cookies?.[CSRF_COOKIE]) {
      const token = generateCsrfToken();
      response.cookie(CSRF_COOKIE, token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });
    }
    return next();
  }

  if (request.headers.authorization) {
    return next();
  }

  const cookieToken = request.cookies?.[CSRF_COOKIE];
  const headerToken = request.headers[CSRF_HEADER] as string;

  if (!cookieToken || !headerToken) {
    return response.status(403).json({ message: 'CSRF token missing' });
  }

  try {
    if (
      !crypto.timingSafeEqual(
        Buffer.from(cookieToken),
        Buffer.from(headerToken)
      )
    ) {
      return response.status(403).json({ message: 'CSRF token mismatch' });
    }
  } catch {
    return response.status(403).json({ message: 'CSRF token invalid' });
  }

  return next();
};

export { csrfProtection, CSRF_COOKIE, CSRF_HEADER };
