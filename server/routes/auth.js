import express from 'express';
const router = express.Router();

import emailExistsMiddleware from '../middleware/auth/emailExists.js';
import { register, login, logout, setup } from '../middleware/auth/index.js';
import customCallback from '../middleware/auth/callback/custom.js';
import discordCallback from '../middleware/auth/callback/discord.js';
import googleCallback from '../middleware/auth/callback/google.js';
import githubCallback from '../middleware/auth/callback/github.js';
import slackCallback from '../middleware/auth/callback/slack.js';
import twitchCallback from '../middleware/auth/callback/twitch.js';
import getConfigMiddleware from '../middleware/auth/config/getConfig.js';
import updateConfigMiddleware from '../middleware/auth/config/update.js';
import redirectUsingProviderMiddleware from '../middleware/auth/platform.js';
import { hasRequiredPermission } from '../middleware/user/hasPermission.js';
import { PermissionsBits } from '../../shared/permissions/bitFlags.js';

router.post('/user/exists', emailExistsMiddleware);
router.post('/register', register);
router.post('/setup', setup);
router.post('/login', login);
router.get('/logout', logout);
router.get('/config', getConfigMiddleware);
router.post(
  '/config/update',
  hasRequiredPermission(PermissionsBits.ADMINISTRATOR),
  updateConfigMiddleware
);
router.get('/platform/:provider', redirectUsingProviderMiddleware);

router.get('/callback/custom', customCallback);
router.get('/callback/discord', discordCallback);
router.get('/callback/github', githubCallback);
router.get('/callback/google', googleCallback);
router.get('/callback/slack', slackCallback);
router.get('/callback/twitch', twitchCallback);

export default router;
