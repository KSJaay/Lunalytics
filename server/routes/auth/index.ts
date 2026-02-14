import { Router } from 'express';
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

initialiseConfigUpdateRoute(authRouter);
initialiseConfigRoute(authRouter);
initialiseCallbackTwitchRoute(authRouter);
initialiseCallbackSlackRoute(authRouter);
initialiseCallbackGoogleRoute(authRouter);
initialiseCallbackGithubRoute(authRouter);
initialiseCallbackDiscordRoute(authRouter);
initialiseCallbackCustomRoute(authRouter);
initialiseUserExistsRoute(authRouter);
initialiseRegisterRoute(authRouter);
initialiseSetupRoute(authRouter);
initialiseLoginRoute(authRouter);
initialiseLogoutRoute(authRouter);
initialisePlatformProviderRoute(authRouter);
initialiseSetupExistsRoute(authRouter);

export default authRouter;
