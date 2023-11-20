class AuthorizationError extends Error {
  constructor(error) {
    super();
    this.name = 'AuthorizationError';
    this.error = error;
  }
}

class UnprocessableError extends Error {
  constructor(error) {
    super();
    this.name = 'UnprocessableError';
    this.error = error;
  }
}

const handleError = (error, response) => {
  if (error instanceof AuthorizationError) {
    return response.status(401).send({
      message: error.error,
    });
  }

  if (error instanceof UnprocessableError) {
    return response.status(422).send({
      message: error.error,
    });
  }

  return response.status(500).send({
    message: 'Something went wrong',
  });
};

module.exports = {
  AuthorizationError,
  handleError,
};
