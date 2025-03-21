import { userExists } from '../database/queries/user.js';
import { deleteCookie } from '../../shared/utils/cookies.js';
import { handleError } from '../utils/errors.js';

const authorization = async (request, response, next) => {
  try {
    const { access_token } = request.cookies;

    if (access_token) {
      const userExistsInDatabase = await userExists(access_token);

      if (userExistsInDatabase) {
        // if user is trying to access `/api/user/verfied` and is already logged in, send user data
        if (request.url.startsWith('/api/user/verfied')) {
          return response.send(userExistsInDatabase);
        }

        if (!userExistsInDatabase.isVerified) {
          return response.sendStatus(403);
        }

        // if user is trying to access login or register page and is already logged in, redirect to home page
        if (
          request.url.startsWith('/login') ||
          request.url.startsWith('/register') ||
          request.url.startsWith('/setup')
        ) {
          return response.redirect('/home');
        }
      }

      if (!userExistsInDatabase) {
        deleteCookie(response, 'access_token');
        return response.sendStatus(401);
      }
    }

    if (request.url.startsWith('/api') && !access_token) {
      return response.sendStatus(401);
    }

    return next();
  } catch (error) {
    deleteCookie(response, 'access_token');
    handleError(error, response);
  }
};

export default authorization;
