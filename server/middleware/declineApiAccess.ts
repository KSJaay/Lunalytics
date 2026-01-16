export const declineApiAccess = async (request, response, next) => {
  if (request.user.isApiToken) {
    return response.sendStatus(401);
  }

  return next();
};
