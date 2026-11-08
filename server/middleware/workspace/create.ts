// import node modules
import { Request, Response } from 'express';

// import local files
import { handleError } from '../../utils/errors.js';
import { createMember } from '../../database/queries/member.js';
import { createWorkspace } from '../../database/queries/workspace.js';
import { setClientSideCookie } from '../../../shared/utils/cookies.js';
import { WORKSPACE_ID_COOKIE } from '../../../shared/constants/cookies.js';
import { MemberPermissionBits } from '../../../shared/permissions/bitFlags.js';

const createWorkspaceMiddleware = async (
  request: Request,
  response: Response
) => {
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
      permission: MemberPermissionBits.ADMINISTRATOR,
    });

    setClientSideCookie(response, WORKSPACE_ID_COOKIE, workspace.id);

    return response.status(201).send('Workspace created successfully.');
  } catch (error) {
    handleError(error, response);
  }
};

export default createWorkspaceMiddleware;
