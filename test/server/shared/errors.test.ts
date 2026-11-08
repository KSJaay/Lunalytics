import { describe, it, expect } from 'vitest';

import {
  AuthorizationError,
  ConflictError,
  UnprocessableError,
  NotificationValidatorError,
  StatusPageValidatorError,
  ObjectSchemaValidatorError,
  MissingDatabaseConnectionError,
} from '../../../shared/utils/errors.js';

describe('shared/utils/errors', () => {
  it('AuthorizationError carries name and message', () => {
    const err = new AuthorizationError('nope');
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('AuthorizationError');
    expect(err.message).toBe('nope');
  });

  it('ConflictError carries name and message', () => {
    const err = new ConflictError('dupe');
    expect(err.name).toBe('ConflictError');
    expect(err.message).toBe('dupe');
  });

  it('UnprocessableError carries name and message', () => {
    const err = new UnprocessableError('bad');
    expect(err.name).toBe('UnprocessableError');
  });

  it('NotificationValidatorError exposes the offending key', () => {
    const err = new NotificationValidatorError('field', 'invalid');
    expect(err.name).toBe('NotificationValidatorError');
    expect(err.key).toBe('field');
    expect(err.message).toBe('invalid');
  });

  it('StatusPageValidatorError carries name and message', () => {
    const err = new StatusPageValidatorError('bad page');
    expect(err.name).toBe('StatusPageValidatorError');
  });

  it('ObjectSchemaValidatorError carries name and message', () => {
    const err = new ObjectSchemaValidatorError('bad schema');
    expect(err.name).toBe('ObjectSchemaValidatorError');
  });

  it('MissingDatabaseConnectionError has a fixed message', () => {
    const err = new MissingDatabaseConnectionError();
    expect(err.name).toBe('MissingDatabaseConnectionError');
    expect(err.message).toBe('Database connection could not be established');
  });
});
