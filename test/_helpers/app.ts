import express, {
  type Application,
  type Request,
  type Response,
} from 'express';
import cookieParser from 'cookie-parser';

import isDemo from '../../server/middleware/demo.js';
import addInviteToCookie from '../../server/middleware/addInviteToCookie.js';
import initialiseRoutes from '../../server/routes/index.js';

export interface BuildAppOptions {
  noAuth?: boolean;
}

export const buildTestApp = async (
  _options: BuildAppOptions = {}
): Promise<Application> => {
  const app = express();

  app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .disable('x-powered-by')
    .set('trust proxy', false)
    .use(cookieParser())
    .use(isDemo)
    .use(addInviteToCookie);

  app.get('/api/ping', (_req: Request, res: Response) =>
    res.status(200).send('ok')
  );

  await initialiseRoutes(app);

  return app;
};
