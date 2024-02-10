// import dependencies
const jwt = require('jsonwebtoken');

// import local files
const logger = require('./logger');

const verifyCookie = (value) => {
  try {
    const jwtSecret =
      process.env.JWT_SECRET || 'lunalyticsJwtSecretKeyHerePlease';

    let token = jwt.verify(value, jwtSecret, {
      algorithms: ['HS256'],
    });
    return token;
  } catch (error) {
    logger.error('JWT Verify', {
      message: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

const signCookie = (value) => {
  try {
    const jwtSecret =
      process.env.JWT_SECRET || 'lunalyticsJwtSecretKeyHerePlease';

    let token = jwt.sign(value, jwtSecret, {
      expiresIn: 2592000,
    });
    return token;
  } catch (error) {
    logger.error('JWT Sign', {
      message: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

module.exports = {
  verifyCookie,
  signCookie,
};
