import { stringToMs } from '../utils/ms.js';
import validators from './index.js';

type SetErrorsFn = (errors: Record<string, string>) => void;

const setupValidators = {
  email: (value: string = '', setErrors: SetErrorsFn): boolean => {
    const isInvalid = validators.auth.email(value);

    if (isInvalid) {
      setErrors(isInvalid);
      return true;
    }

    setErrors({ email: '' });
    return false;
  },

  username: (value: string = '', setErrors: SetErrorsFn): boolean => {
    const isInvalid = validators.auth.username(value);

    if (isInvalid) {
      setErrors(isInvalid);
      return true;
    }

    setErrors({ username: '' });
    return false;
  },

  password: (value: string = '', setErrors: SetErrorsFn): boolean => {
    const isInvalid = validators.auth.password(value);

    if (isInvalid) {
      setErrors(isInvalid);
      return true;
    }

    setErrors({ password: '' });
    return false;
  },

  confirmPassword: (
    confirmPassword: string,
    setErrors: SetErrorsFn,
    password: string
  ): boolean => {
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return true;
    }

    setErrors({ confirmPassword: '' });
    return false;
  },

  websiteUrl: (value: string = '', setErrors: SetErrorsFn): boolean => {
    const websiteUrl = /^https?:\/\//;
    const isInvalid = websiteUrl.test(value);

    if (!isInvalid) {
      setErrors({
        websiteUrl:
          'Please enter a valid URL. Only http:// or https:// is allowed.',
      });
      return true;
    }

    setErrors({ websiteUrl: '' });
    return false;
  },

  retentionPeriod: (value: string = '', setErrors: SetErrorsFn): boolean => {
    const ms = stringToMs(value);
    const minMs = stringToMs('6h');
    if (!ms || ms < minMs) {
      setErrors({
        retentionPeriod:
          'Invalid retention period. Rentention period must be at least 6 hours.',
      });
      return true;
    }
    setErrors({ retentionPeriod: '' });
    return false;
  },

  migrationType: (input: string = '', setErrors: SetErrorsFn): boolean => {
    const value = input?.toLowerCase();
    const isInvalid =
      value !== 'automatic' && value !== 'manual'
        ? 'Please select a valid migration type.'
        : false;

    if (isInvalid) {
      setErrors({ general: isInvalid });
      return true;
    }

    setErrors({ general: '' });
    return false;
  },

  databaseType: (input: string = '', setErrors: SetErrorsFn): boolean => {
    const value = input?.toLowerCase();
    const isInvalid =
      value !== 'better-sqlite3' && value !== 'pg'
        ? 'Please select a valid database type.'
        : false;

    if (isInvalid) {
      setErrors({ general: isInvalid });
      return true;
    }

    setErrors({ general: '' });
    return false;
  },

  databaseName: (value: string = '', setErrors: SetErrorsFn): boolean => {
    if (value.length < 3 || value.length > 32) {
      setErrors({
        databaseName: 'Database name must be between 3 and 32 characters.',
      });
      return true;
    }

    const textRegex = /^[a-zA-Z]+$/;

    if (!textRegex.test(value)) {
      setErrors({
        databaseName: 'Database name can only contain letters.',
      });
      return true;
    }

    setErrors({ databaseName: '' });
    return false;
  },

  postgresHost: (value: string = '', setErrors: SetErrorsFn): boolean => {
    if (!value) return false;

    if (!value) {
      setErrors({
        postgresHost: 'Postgres host must be a valid address.',
      });
      return true;
    }

    setErrors({ postgresHost: '' });
    return false;
  },

  postgresPort: (value: string = '', setErrors: SetErrorsFn): boolean => {
    if (!value) return false;

    const isInvalid = validators.monitor.tcpPort(value);

    if (isInvalid) {
      setErrors({ postgresPort: isInvalid });
      return true;
    }

    setErrors({ postgresPort: '' });
    return false;
  },

  postgresUser: (value: string = '', setErrors: SetErrorsFn): boolean => {
    if (!value) return false;

    const usernameRegex = /^[a-zA-Z_][a-zA-Z0-9_]{0,62}$/;

    if (!usernameRegex.test(value)) {
      setErrors({
        postgresUser: 'Postgres user must be a valid username.',
      });
      return true;
    }

    setErrors({ postgresUser: '' });
    return false;
  },

  postgresPassword: (value: string = '', setErrors: SetErrorsFn): boolean => {
    if (!value) return false;

    const passwordRegex = /^[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(value)) {
      setErrors({
        postgresPassword: 'Postgres password must be a valid password.',
      });
      return true;
    }

    setErrors({ postgresPassword: '' });
    return false;
  },
};

export default setupValidators;
