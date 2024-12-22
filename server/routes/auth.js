import express from 'express';
const router = express.Router();

import { register, login, logout, setup } from '../middleware/auth/index.js';
import { emailExists, ownerExists } from '../database/queries/user.js';
import config from '../utils/config.js';

router.post('/user/exists', async (request, response) => {
  const { email } = request.body;
  if (!email) return response.status(400).send('No email provided');

  const user = await emailExists(email);
  if (!user) return response.send(false);

  return response.send(true);
});

router.post('/register', register);
router.post('/setup', setup);
router.get('/setup/exists', async (request, response) => {
  try {
    const databaseName = config.get('database')?.name;

    if (!databaseName) {
      return response.send({ ownerExists: false });
    }

    const query = await ownerExists();

    response.send({ ownerExists: query });
  } catch (error) {
    return response.status(400).send(error);
  }
});
router.post('/login', login);
router.get('/logout', logout);

export default router;
