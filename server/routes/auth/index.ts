import { Router } from 'express';
import { authRateLimiter } from '../../middleware/rateLimiter.js';
import initialiseLoginRoute from './login.js';
import initialiseSetupRoute from './setup.js';
import initialiseConfigRoute from './config.js';
import initialiseLogoutRoute from './logout.js';
import initialiseRegisterRoute from './register.js';
import initialiseUserExistsRoute from './user-exists.js';
import initialiseSetupExistsRoute from './setup-exists.js';
import initialiseConfigUpdateRoute from './config-update.js';
import initialiseCallbackTwitchRoute from './callback-twitch.js';
import initialiseCallbackSlackRoute from './callback-slack.js';
import initialiseCallbackGoogleRoute from './callback-google.js';
import initialiseCallbackGithubRoute from './callback-github.js';
import initialiseCallbackDiscordRoute from './callback-discord.js';
import initialiseCallbackCustomRoute from './callback-custom.js';
import initialisePlatformProviderRoute from './platform-provider.js';

const authRouter = Router();

initialiseSetupExistsRoute(authRouter);
initialiseConfigRoute(authRouter);
initialiseConfigUpdateRoute(authRouter);
initialiseUserExistsRoute(authRouter);
initialiseLogoutRoute(authRouter);

authRouter.use('/api/auth', authRateLimiter);

initialiseCallbackTwitchRoute(authRouter);
initialiseCallbackSlackRoute(authRouter);
initialiseCallbackGoogleRoute(authRouter);
initialiseCallbackGithubRoute(authRouter);
initialiseCallbackDiscordRoute(authRouter);
initialiseCallbackCustomRoute(authRouter);
initialiseRegisterRoute(authRouter);
initialiseSetupRoute(authRouter);
initialiseLoginRoute(authRouter);
initialisePlatformProviderRoute(authRouter);

export default authRouter;
