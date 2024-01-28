const express = require('express');
const router = express.Router();

const { register, login, logout } = require('../middleware/auth');
const { emailExists } = require('../database/queries/user');

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

module.exports = router;
