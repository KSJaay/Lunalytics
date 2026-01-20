// import type definitions
import type { NextFunction, Request, Response } from 'express';

export const declineApiAccess = async (
  _request: Request,
  response: Response,
  next: NextFunction
) => {
  if (response.locals?.user?.isApiToken) {
    return response.sendStatus(401);
  }

  return next();
};
