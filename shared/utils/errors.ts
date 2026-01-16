class AuthorizationError extends Error {
  constructor(error: string) {
    super(error);
    this.name = 'AuthorizationError';
  }
}

class UnprocessableError extends Error {
  constructor(error: string) {
    super(error);
    this.name = 'UnprocessableError';
  }
}

class ConflictError extends Error {
  constructor(error: string) {
    super(error);
    this.name = 'ConflictError';
  }
}

class NotificationValidatorError extends Error {
  key: string;
  constructor(key: string, error: string) {
    super(error);
    this.name = 'NotificationValidatorError';
    this.key = key;
  }
}

class StatusPageValidatorError extends Error {
  constructor(error: string) {
    super(error);
    this.name = 'StatusPageValidatorError';
  }
}

class ObjectSchemaValidatorError extends Error {
  constructor(error: string) {
    super(error);
    this.name = 'ObjectSchemaValidatorError';
  }
}

class MissingDatabaseConnectionError extends Error {
  constructor() {
    super('Database connection could not be established');
    this.name = 'MissingDatabaseConnectionError';
  }
}

export {
  AuthorizationError,
  ConflictError,
  NotificationValidatorError,
  UnprocessableError,
  StatusPageValidatorError,
  ObjectSchemaValidatorError,
  MissingDatabaseConnectionError,
};
