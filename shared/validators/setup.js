import { msToTime, stringToMs } from '../utils/ms.js';
import validators from './index.js';

const setupValidators = {
  email: (value = '', setErrors) => {
    const isInvalid = validators.auth.email(value);

    if (isInvalid) {
      setErrors(isInvalid);
      return true;
    }

    setErrors({ email: '' });
    return false;
  },

  username: (value = '', setErrors) => {
    const isInvalid = validators.auth.username(value);

    if (isInvalid) {
      setErrors(isInvalid);
      return true;
    }

    setErrors({ username: '' });
    return false;
  },

  password: (value = '', setErrors) => {
    const isInvalid = validators.auth.password(value);

    if (isInvalid) {
      setErrors(isInvalid);
      return true;
    }

    setErrors({ password: '' });
    return false;
  },

  confirmPassword: (confirmPassword, setErrors, password) => {
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return true;
    }

    setErrors({ confirmPassword: '' });
    return false;
  },

  jwtSecret: (value = '', setErrors) => {
    if (!value) return false;

    if (value.length < 8 || value.length > 128) {
      setErrors({
        jwtSecret: 'JWT Secret must be at between 8 and 128 characters.',
      });

      return true;
    }

    setErrors({ jwtSecret: '' });
    return false;
  },

  websiteUrl: (value = '', setErrors) => {
    const websiteUrl =
      /^https?:\/\/(localhost(:\d{1,5})?|\d{1,3}(\.\d{1,3}){3}:\d{1,5}|[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+(:\d{1,5})?)$/g;
    const isInvalid = websiteUrl.test(value);

    if (!isInvalid) {
      setErrors({ websiteUrl: 'Please enter a valid URL.' });
      return true;
    }

    setErrors({ websiteUrl: '' });
    return false;
  },

  retentionPeriod: (value = '', setErrors) => {
    const ms = stringToMs(value);

    if (!ms || ms < msToTime('6h')) {
      setErrors({
        retentionPeriod:
          'Invalid retention period. Rentention period must be at least 6 hours.',
      });
      return true;
    }

    setErrors({ retentionPeriod: '' });
    return false;
  },

  migrationType: (input = '', setErrors) => {
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

  databaseType: (input = '', setErrors) => {
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

  databaseName: (value = '', setErrors) => {
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

  postgresHost: (value = '', setErrors) => {
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

  postgresPort: (value = '', setErrors) => {
    if (!value) return false;

    const isInvalid = validators.monitor.tcpPort(value);

    if (isInvalid) {
      setErrors({ postgresPort: isInvalid });
      return true;
    }

    setErrors({ postgresPort: '' });
    return false;
  },

  postgresUser: (value = '', setErrors) => {
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

  postgresPassword: (value = '', setErrors) => {
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
