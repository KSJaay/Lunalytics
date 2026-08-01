import * as zod from 'zod';
import { isValidBitFlags } from '../permissions/isValidBitFlags.js';
import { checkWithZod } from './zod.js';

export interface TokenValidatorInput {
  token?: string;
  name?: string;
  permission: number;
  isEdit?: boolean;
}

// const TokenValidator = ({
//   token,
//   name,
//   permission,
//   isEdit = false,
// }: TokenValidatorInput): string | false => {
//   if (!isValidBitFlags(permission)) {
//     return 'Permission is not valid';
//   }

//   if (name && name.length > 64) {
//     return 'Name cannot be longer than 64 characters';
//   }

//   if (isEdit && !name) {
//     return 'Please provide a name for the token';
//   }

//   if (isEdit && !token) {
//     return 'Please provide a token';
//   }

//   return false;
// };

const zodTokenValidator = zod
  .object({
    token: zod.string().optional(),
    name: zod.string().max(64, 'common.error.tokenNameTooLong').optional(),
    permission: zod.number().refine(isValidBitFlags, {
      message: 'common.error.invalidPermissions',
    }),
    isEdit: zod.boolean().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.isEdit) {
      if (!value.name) {
        ctx.addIssue({
          code: 'invalid_type',
          expected: 'string',
          message: 'common.error.tokenNameRequired',
        });
      }
      if (!value.token) {
        ctx.addIssue({
          code: 'invalid_type',
          expected: 'string',
          message: 'common.error.tokenRequired',
        });
      }
    }
  });

const TokenValidator = ({
  token,
  name,
  permission,
  isEdit = false,
}: TokenValidatorInput) =>
  checkWithZod(zodTokenValidator, {
    token,
    name,
    permission,
    isEdit,
  });

export default TokenValidator;
