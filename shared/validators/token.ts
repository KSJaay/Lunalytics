import { isValidBitFlags } from '../permissions/isValidBitFlags.js';

export interface TokenValidatorInput {
  token?: string;
  name?: string;
  permission: number;
  isEdit?: boolean;
}

const TokenValidator = ({
  token,
  name,
  permission,
  isEdit = false,
}: TokenValidatorInput): string | false => {
  if (!isValidBitFlags(permission)) {
    return 'Permission is not valid';
  }

  if (name && name.length > 64) {
    return 'Name cannot be longer than 64 characters';
  }

  if (isEdit && !name) {
    return 'Please provide a name for the token';
  }

  if (isEdit && !token) {
    return 'Please provide a token';
  }

  return false;
};

export default TokenValidator;
