import { Router } from 'express';
import initialiseBaseRoute from './base.js';

const statusRouter = Router();

initialiseBaseRoute(statusRouter);

export default statusRouter;
