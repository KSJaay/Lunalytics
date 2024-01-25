const { userExists } = require('../database/queries/user');
const { deleteCookie } = require('../utils/cookies');
const { createURL } = require('../utils/url');

const authorization = async (request, response, next) => {
  const { access_token } = request.cookies;

  if (access_token) {
    const userExistsInDatabase = await userExists(access_token);

    if (userExistsInDatabase) {
      if (!userExistsInDatabase.isVerified) {
        return response.redirect(createURL('/verify'));
      }

      // if user is trying to access login or register page and is already logged in, redirect to home page
      if (
        request.url.startsWith('/login') ||
        request.url.startsWith('/register')
      ) {
        return response.redirect(createURL('/'));
      }
    }

    if (!userExistsInDatabase) {
      deleteCookie(response, 'access_token');
      return response.redirect(createURL('/login'));
    }
  }

  if (request.url.startsWith('/login') || request.url.startsWith('/register')) {
    return next();
  }

  if (!access_token) {
    return response.redirect(createURL('/login'));
  }

  return next();
};

module.exports = authorization;
