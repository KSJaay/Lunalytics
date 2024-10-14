import { fetchMembers } from '../../../database/queries/user.js';
import { handleError } from '../../../utils/errors.js';

const teamMembersListMiddleware = async (request, response) => {
  try {
    const members = await fetchMembers();

    return response.send(members);
  } catch (error) {
    handleError(error, response);
  }
};

export default teamMembersListMiddleware;
