import express from 'express';
const router = express.Router();

import { register, login, logout } from '../middleware/auth/index.js';
import { emailExists } from '../database/queries/user.js';

router.post('/user/exists', async (request, response) => {
  const { email } = request.body;
  if (!email) return response.status(400).send('No email provided');

  const user = await emailExists(email);
  if (!user) return response.send(false);

  return response.send(true);
});

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

export default router;
