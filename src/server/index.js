// Import node_modules
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();

// import local files
const validate = require('./utils/validators');
const { signInUser, userExists, registerUser } = require('./database/queries');
const SQLite = require('./database/sqlite/setup');
const Logger = require('./utils/logger');
const { handleError, UnprocessableError } = require('./utils/errors');
const {
  setServerSideCookie,
  setClientSideCookie,
  deleteCookie,
} = require('./utils/cookies');

const app = express();

async function init() {
  // connect to database and setup database tables
  await SQLite.connect();
  await SQLite.setup();

  app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .disable('x-powered-by')
    .set('trust proxy', 1)
    .use(
      cors({
        origin: [process.env.APP_URL],
        credentials: true,
      })
    )
    .use(cookieParser());

  if (process.env.MODE === 'production') {
    app.use(express.static(path.join(__dirname, '..', '..', 'dist')));
  }

  app.use(async (request, response, next) => {
    const { userToken } = request.cookies;

    if (userToken) {
      const userExistsInDatabase = await userExists(userToken);

      if (userExistsInDatabase) {
        if (
          request.url.startsWith('/login') ||
          request.url.startsWith('/register')
        ) {
          return response.redirect('/');
        }
      }
    }

    if (
      request.url.startsWith('/login') ||
      request.url.startsWith('/register')
    ) {
      return next();
    }

    if (!userToken) {
      return response.redirect('/login');
    }

    return next();
  });

  app.post('/login', async (request, response) => {
    try {
      const { username, password } = request.body;

      const isInvalidEmail = validate.email(username);

      const { jwt, user } = await signInUser(
        username,
        password,
        isInvalidEmail
      );

      setServerSideCookie(response, 'userToken', jwt);
      setClientSideCookie(response, 'user', JSON.stringify(user));

      return response.sendStatus(200);
    } catch (error) {
      console.log(error);
      return handleError(error, response);
    }
  });

  app.post('/register', async (request, response) => {
    try {
      const { email, username, password } = request.body;

      const isInvalidEmail = validate.email(email);
      const isInvalidUsername = validate.username(username);
      const isInvalidPassword = validate.password(password);

      if (isInvalidEmail || isInvalidUsername || isInvalidPassword) {
        throw new UnprocessableError(
          isInvalidEmail || isInvalidUsername || isInvalidPassword
        );
      }

      const { jwt, user } = await registerUser(email, username, password);
      setServerSideCookie(response, 'userToken', jwt);
      setClientSideCookie(response, 'user', JSON.stringify(user));

      return response.sendStatus(200);
    } catch (error) {
      return handleError(error, response);
    }
  });

  app.get('/logout', async (request, response) => {
    try {
      deleteCookie(response, 'userToken');
      deleteCookie(response, 'user');

      return response.redirect('/login');
    } catch (error) {
      return handleError(error, response);
    }
  });

  if (process.env.MODE === 'production') {
    app.get('*', function (request, response) {
      response.sendFile(path.join(__dirname, '..', '..', 'dist', 'index.html'));
    });
  }

  // Start the server
  const server_port = process.env.PORT || 5050;
  app.listen(server_port, () => {
    Logger.info('Express', `Server is running on port ${server_port}`);
  });
}

init();
