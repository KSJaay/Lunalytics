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

class ConflictError extends Error {
  constructor(error) {
    super();
    this.name = 'ConflictError';
    this.error = error;
  }
}

class NotificationValidatorError extends Error {
  constructor(key, error) {
    super();
    this.name = 'NotificationValidatorError';
    this.key = key;
    this.message = error;
  }
}

class StatusPageValidatorError extends Error {
  constructor(error) {
    super();
    this.name = 'StatusPageValidatorError';
    this.message = error;
  }
}

class ObjectSchemaValidatorError extends Error {
  constructor(error) {
    super();
    this.name = 'ObjectSchemaValidatorError';
    this.message = error;
  }
}

export {
  AuthorizationError,
  ConflictError,
  NotificationValidatorError,
  UnprocessableError,
  StatusPageValidatorError,
  ObjectSchemaValidatorError,
};
