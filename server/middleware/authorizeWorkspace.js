import {
  WORKSPACE_ID_COOKIE,
  WORKSPACE_ID_HEADER,
} from '../../shared/constants/cookies.js';
import { setClientSideCookie } from '../../shared/utils/cookies.js';
import database from '../database/connection.js';
import { fetchMember } from '../database/queries/member.js';
import { fetchWorkspace } from '../database/queries/workspace.js';

const authorizeWorkspace = async (request, response, next) => {
  const workspaceId =
    request.headers[WORKSPACE_ID_HEADER] ||
    request.cookies[WORKSPACE_ID_COOKIE];

  if (!workspaceId) {
    return response.redirect('/workspace/select');
  }

  if (!database.client) return next();

  let workspace = await fetchWorkspace(workspaceId);

  if (!workspace) {
    return response.redirect('/workspace/select');
  }

  setClientSideCookie(response, WORKSPACE_ID_COOKIE, workspace?.id);
  response.locals.workspaceId = workspace?.id;

  const member = await fetchMember(response.locals.user.email, workspace.id);

  if (!member) {
    return response
      .status(403)
      .send('You do not have access to this workspace.');
  }

  response.locals.member = member;

  next();
};

export default authorizeWorkspace;
