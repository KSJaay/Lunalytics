import express from 'express';

import { createWorkspace } from '../database/queries/workspace.js';
import { createMember } from '../database/queries/member.js';
import { setClientSideCookie } from '../../shared/utils/cookies.js';
import { WORKSPACE_ID_COOKIE } from '../../shared/constants/cookies.js';
import { handleError } from '../utils/errors.js';

const router = express.Router();

router.post('/create', async (request, response) => {
  try {
    const { name, icon } = request.body;

    if (!name) {
      return response.status(400).send('Workspace name is required.');
    }

    if (name.length > 32) {
      return response
        .status(400)
        .send('Workspace name must be less than 32 characters.');
    }

    const workspace = await createWorkspace(
      name,
      icon,
      response.locals.user.email
    );

    await createMember({
      email: response.locals.user.email,
      workspaceId: workspace.id,
    });

    setClientSideCookie(response, WORKSPACE_ID_COOKIE, workspace.id);

    return response.status(201).send('Workspace created successfully.');
  } catch (error) {
    handleError(error, response);
  }
});

export default router;
