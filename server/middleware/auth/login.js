// import local files
const { signInUser } = require('../../database/queries/user');
const { setServerSideCookie } = require('../../utils/cookies');
const { handleError } = require('../../utils/errors');

const login = async (request, response) => {
  try {
    const { username, password } = request.body;

    const isInvalidEmail = new RegExp(/@/g).test(username);

    const jwt = await signInUser(username, password, !isInvalidEmail);

    setServerSideCookie(response, 'access_token', jwt);

    return response.sendStatus(200);
  } catch (error) {
    return handleError(error, response);
  }
};

module.exports = login;
