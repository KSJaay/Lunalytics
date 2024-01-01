const { deleteCookie } = require('../../utils/cookies');
const { handleError } = require('../../utils/errors');
const { createURL } = require('../../utils/url');

const logout = (request, response) => {
  try {
    deleteCookie(response, 'userToken');
    deleteCookie(response, 'user');

    return response.redirect(createURL('/login'));
  } catch (error) {
    return handleError(error, response);
  }
};

module.exports = logout;
