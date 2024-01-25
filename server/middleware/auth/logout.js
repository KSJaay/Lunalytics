const { deleteCookie } = require('../../utils/cookies');
const { handleError } = require('../../utils/errors');
const { createURL } = require('../../utils/url');

const logout = (request, response) => {
  try {
    deleteCookie(response, 'access_token');

    return response.redirect(createURL('/login'));
  } catch (error) {
    return handleError(error, response);
  }
};

module.exports = logout;
