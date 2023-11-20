// Import node_modules
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();

// import local files
const validate = require('./utils/validators');
const { signInUser } = require('./database/queries');
const SQLite = require('./database/sqlite/setup');
const Logger = require('./utils/logger');
const { handleError } = require('./utils/errors');
const { setServerSideCookie } = require('./utils/cookies');

const app = express();

async function init() {
  // connect to database and setup database tables
  await SQLite.connect();
  await SQLite.setup();

  app
    .use(cookieParser())
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .disable('x-powered-by')
    .set('trust proxy', 1)
    .use(cors());

  app.post('/login', async (request, response) => {
    try {
      const { username, password } = request.body;

      const isEmail = validate.email(username);

      const userToken = await signInUser(username, password, isEmail);

      setServerSideCookie(response, 'userToken', userToken);

      return response.status(200).send({ message: 'Successfully logged in' });
    } catch (error) {
      return handleError(error, response);
    }
  });

  app.get('/', (request, response) => {
    response.send('Hello World!');
  });

  // Start the server
  const server_port = process.env.PORT || 5050;
  app.listen(server_port, () => {
    Logger.info('Express', `Server is running on port ${server_port}`);
  });
}

init();
