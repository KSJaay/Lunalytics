import { fetchMembers } from '../../../database/queries/user.js';

const teamMembersListMiddleware = async (request, response) => {
  const members = await fetchMembers();

  return response.send(members);
};

export default teamMembersListMiddleware;
