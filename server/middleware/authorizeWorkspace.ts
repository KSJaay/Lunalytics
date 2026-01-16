import {
  WORKSPACE_ID_COOKIE,
  WORKSPACE_ID_HEADER,
} from '../../shared/constants/cookies.js';
import { setClientSideCookie } from '../../shared/utils/cookies.js';
import database from '../database/connection.js';
import { fetchMember } from '../database/queries/member.js';
import { fetchWorkspace } from '../database/queries/workspace.js';
import { WORKSPACE_ERRORS } from '../../shared/constants/errors/workspace.js';

const authorizeWorkspace = async (request, response, next) => {
  const workspaceId =
    request.headers[WORKSPACE_ID_HEADER] ||
    request.cookies[WORKSPACE_ID_COOKIE];

  if (!workspaceId) {
    return response.status(400).json(WORKSPACE_ERRORS.W004);
  }

  if (!database.client) return next();

  let workspace = await fetchWorkspace(workspaceId);

  if (!workspace) {
    return response.status(404).json(WORKSPACE_ERRORS.W001);
  }

  setClientSideCookie(response, WORKSPACE_ID_COOKIE, workspace?.id);
  response.locals.workspaceId = workspace?.id;

  const member = await fetchMember(response.locals.user.email, workspace.id);

  if (!member) {
    return response.status(403).json(WORKSPACE_ERRORS.W003);
  }

  response.locals.member = member;

  next();
};

export default authorizeWorkspace;
