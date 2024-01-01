const { userExists } = require('../database/queries');
const { createURL } = require('../utils/url');

const authorization = async (request, response, next) => {
  const { userToken } = request.cookies;

  if (userToken) {
    const userExistsInDatabase = await userExists(userToken);

    if (userExistsInDatabase) {
      if (
        request.url.startsWith('/login') ||
        request.url.startsWith('/register')
      ) {
        return response.redirect(createURL('/'));
      }
    }
  }

  if (request.url.startsWith('/login') || request.url.startsWith('/register')) {
    return next();
  }

  if (!userToken) {
    return response.redirect(createURL('/login'));
  }

  return next();
};

module.exports = authorization;
