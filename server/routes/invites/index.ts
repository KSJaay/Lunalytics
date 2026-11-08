import { Router } from 'express';
import initialiseDeleteRoute from './delete.js';
import initialisePauseRoute from './pause.js';
import initialiseCreateRoute from './create.js';
import initialiseAllRoute from './all.js';

const invitesRouter = Router();

initialiseAllRoute(invitesRouter);
initialiseCreateRoute(invitesRouter);
initialisePauseRoute(invitesRouter);
initialiseDeleteRoute(invitesRouter);

export default invitesRouter;
