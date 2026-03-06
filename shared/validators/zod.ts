import { NotificationValidatorError } from '../utils/errors';

export const checkWithZod = (schema: any, value: unknown) => {
  try {
    const data = schema.parse(value);
    return data;
  } catch (error: any) {
    return {
      isValidationError: true,
      key: error?.issues?.[0]?.path?.[0] || 'unknown',
      message:
        error?.issues?.[0]?.message ||
        'Unknown error occurred during validation.',
    };
  }
};

export const checkNotificationWithZod = (schema: any, value: unknown) => {
  const result = checkWithZod(schema, value);
  if (result?.isValidationError) {
    throw new NotificationValidatorError(result.key, result.message);
  }
  return result;
};
