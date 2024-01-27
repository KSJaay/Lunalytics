// import local files
const { signInUser } = require('../../database/queries/user');
const { setServerSideCookie } = require('../../utils/cookies');
const { handleError, UnprocessableError } = require('../../utils/errors');
const validators = require('../../utils/validators');

const login = async (request, response) => {
  try {
    const { email, password } = request.body;

    const isInvalidAuth =
      validators.auth.email(email) || validators.auth.password(password);

    if (isInvalidAuth) {
      throw new UnprocessableError(isInvalidAuth);
    }

    const { jwt, user } = await signInUser(email.toLowerCase(), password);

    setServerSideCookie(response, 'access_token', jwt);

    if (!user.isVerified) {
      return response.sendStatu(418);
    }

    return response.sendStatus(200);
  } catch (error) {
    return handleError(error, response);
  }
};

module.exports = login;
