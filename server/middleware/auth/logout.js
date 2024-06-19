import { deleteCookie } from '../../../shared/utils/cookies.js';
import { handleError } from '../../../shared/utils/errors.js';
import { createURL } from '../../../shared/utils/url.js';

const logout = (request, response) => {
  try {
    deleteCookie(response, 'access_token');

    return response.redirect(createURL('/login'));
  } catch (error) {
    return handleError(error, response);
  }
};

export default logout;
