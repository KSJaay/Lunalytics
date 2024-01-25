const { userExists, fetchMembers } = require('../../../database/queries/user');

const teamMembersListMiddleware = async (request, response) => {
  const { access_token } = request.cookies;
  const user = await userExists(access_token);
  const members = await fetchMembers();

  const data = {
    currentUser: {
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      isVerified: user.isVerified,
      permission: user.permission,
      createdAt: user.createdAt,
    },
    members,
  };

  data.currentUser.canEdit = [1, 2, 3].includes(user.permission);
  data.currentUser.canManage = [1, 2].includes(user.permission);

  return response.send(data);
};

module.exports = teamMembersListMiddleware;
