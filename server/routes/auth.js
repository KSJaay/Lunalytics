import express from 'express';
const router = express.Router();

import emailExistsMiddleware from '../middleware/auth/emailExists.js';
import { register, login, logout, setup } from '../middleware/auth/index.js';
import setupExistsMiddleware from '../middleware/auth/setupExists.js';

router.post('/user/exists', emailExistsMiddleware);

router.post('/register', register);
router.post('/setup', setup);
router.get('/setup/exists', setupExistsMiddleware);
router.post('/login', login);
router.get('/logout', logout);

export default router;
