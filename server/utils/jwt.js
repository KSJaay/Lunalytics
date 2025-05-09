// import dependencies
import jwt from 'jsonwebtoken';

// import local files
import logger from './logger.js';
import config from './config.js';

const verifyCookie = (value) => {
  try {
    const jwtSecret = config.get('jwtSecret');
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
    const jwtSecret = config.get('jwtSecret');
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

export { verifyCookie, signCookie };
