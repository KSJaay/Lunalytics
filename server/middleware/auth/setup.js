// import dependencies
import fs from 'fs';
import path from 'path';

// import local files
import { getSetupKeys } from '../../../shared/data/setup.js';
import setupValidators from '../../../shared/validators/setup.js';
import logger from '../../utils/logger.js';
import { loadJSON } from '../../../shared/parseJson.js';
import { ownerExists, registerUser } from '../../database/queries/user.js';
import { setServerSideCookie } from '../../../shared/utils/cookies.js';
import { handleError } from '../../utils/errors.js';
import client from '../../database/sqlite/setup.js';
import config from '../../utils/config.js';
import { createUserSession } from '../../database/queries/session.js';
import { parseUserAgent } from '../../utils/uaParser.js';

const packageJson = loadJSON('package.json');

/**
 * Creates the data directory if it does not exist.
 *
 * The data directory is where things like the SQLite database and
 * uploaded certificates are stored.
 */
const createDataDirIfNotExist = () => {
  if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
    fs.mkdirSync(path.join(process.cwd(), 'data'));
  }
};

/**
 * Writes the config to the `config.json` file in the `data` directory.
 *
 * @param {Object} config - The config object to write to the file.
 */
const writeConfigFile = (config = {}) => {
  fs.writeFileSync(
    path.join(process.cwd(), 'data', 'config.json'),
    JSON.stringify(config, null, 2)
  );
};

const createBasicSetup = ({
  databaseType,
  databaseName,
  websiteUrl,
  migrationType,
  retentionPeriod = '6m',
}) => {
  const config = {
    port: 2308,
    database: { name: databaseName, type: databaseType, config: {} },
    migrationType,
    version: packageJson.version,
    websiteUrl,
    retentionPeriod,
  };

  createDataDirIfNotExist();
  writeConfigFile(config);

  logger.info('SETUP', { message: 'Config file created successfully' });
};

const createAdvancedSetup = ({
  databaseType,
  databaseName,
  websiteUrl,
  migrationType,
  postgresHost = 'localhost',
  postgresPort = '5432',
  postgresUser = 'postgres',
  postgresPassword,
  retentionPeriod = '6m',
}) => {
  const config = {
    port: 2308,
    database: { name: databaseName, type: databaseType, config: {} },
    migrationType,
    version: packageJson.version,
    websiteUrl,
    retentionPeriod,
  };

  if (databaseType === 'pg') {
    config.database.config = {
      host: postgresHost,
      port: postgresPort,
      user: postgresUser,
      password: postgresPassword,
    };
  }

  createDataDirIfNotExist();
  writeConfigFile(config);

  logger.info('SETUP', { message: 'Config file created successfully' });
};

const setupMiddleware = async (request, response) => {
  try {
    const { type = 'advanced', email, username, password } = request.body;

    if (type !== 'basic' && type !== 'advanced') {
      return response.status(400).send({ general: 'Invalid setup type' });
    }

    if (config.get('database')?.name) {
      const exists = await ownerExists().catch(() => false);

      if (exists) {
        return response.status(400).send({
          general:
            'Owner already exists, please delete the current database and try again.',
          errorType: 'ownerExists',
        });
      }
    }

    const keys = getSetupKeys(type, request.body.databaseType);
    let errors = {};

    const setErrors = (error) => {
      const [value] = Object.values(error);
      if (!value) return;
      errors = { ...errors, ...error };
    };

    for (const key of keys) {
      const validator = setupValidators[key];
      validator(request.body[key], setErrors);
    }

    if (Object.keys(errors).filter(Boolean).length) {
      return response.status(400).send(errors);
    }

    if (type === 'basic') {
      createBasicSetup(request.body);
    }

    if (type === 'advanced') {
      createAdvancedSetup(request.body);
    }

    config.readConfigFile();
    await client.connect();
    await client.setup();

    const query = await ownerExists();

    if (query) {
      return response.status(400).send({
        general:
          'Owner already exists, please delete the current database and try again or login to your account.',
        errorType: 'ownerExists',
      });
    }

    const data = {
      email: email.toLowerCase(),
      displayName: username,
      password,
      avatar: null,
      permission: 1,
      isVerified: true,
      createdAt: new Date().toISOString(),
    };

    await registerUser(data);

    const userAgent = request.headers['user-agent'];
    const agentData = parseUserAgent(userAgent);

    const sessionToken = await createUserSession(
      data.email,
      agentData.device,
      agentData.data
    );

    setServerSideCookie(
      response,
      'session_token',
      sessionToken,
      request.protocol === 'https'
    );

    return response.sendStatus(200);
  } catch (error) {
    logger.error('SETUP', {
      message: 'Unable to setup application. Please try again.',
      error: error.message,
      stack: error.stack,
    });

    return handleError(error, response);
  }
};

export default setupMiddleware;
