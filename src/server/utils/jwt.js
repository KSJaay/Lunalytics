// import node_modules
const jwt = require('jsonwebtoken');

// import local files
const logger = require('../utils/logger');

const verifyCookie = (value) => {
  try {
    let token = jwt.verify(value, process.env.JWT_SECRET, {
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
    let token = jwt.sign(value, process.env.JWT_SECRET, {
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
