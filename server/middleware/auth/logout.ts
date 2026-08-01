// import type definitions
import type { Request, Response } from 'express';

// import local files
import { deleteCookie } from '../../../shared/utils/cookies.js';
import { handleError } from '../../utils/errors.js';
import { createURL } from '../../../shared/utils/url.js';
import {
  SESSION_TOKEN,
  WORKSPACE_ID_COOKIE,
} from '../../../shared/constants/cookies.js';
import { deleteUserSession } from '../../database/queries/session.js';

const logout = async (_request: Request, response: Response) => {
  try {
    const { [SESSION_TOKEN]: sessionToken } = _request.cookies || {};

    await deleteUserSession(sessionToken);

    deleteCookie(response, SESSION_TOKEN);
    deleteCookie(response, WORKSPACE_ID_COOKIE);

    return response.redirect(createURL('/login'));
  } catch (error) {
    handleError(error, response);
  }
};

export default logout;
