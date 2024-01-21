// import local files
const { registerUser } = require('../../database/queries/user');
const {
  setServerSideCookie,
  setClientSideCookie,
} = require('../../utils/cookies');
const { handleError, UnprocessableError } = require('../../utils/errors');
const validate = require('../../utils/validators');

const register = async (request, response) => {
  try {
    const { email, username, password } = request.body;

    const isInvalidAuth = validate.auth(username, password, email);

    if (isInvalidAuth) {
      throw new UnprocessableError(isInvalidAuth);
    }

    const { jwt, user } = await registerUser(email, username, password);
    setServerSideCookie(response, 'userToken', jwt);
    setClientSideCookie(response, 'user', JSON.stringify(user));

    return response.sendStatus(200);
  } catch (error) {
    return handleError(error, response);
  }
};

module.exports = register;
