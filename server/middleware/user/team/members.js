const { fetchMembers } = require('../../../database/queries/user');

const teamMembersListMiddleware = async (request, response) => {
  const members = await fetchMembers();

  return response.send(members);
};

module.exports = teamMembersListMiddleware;
