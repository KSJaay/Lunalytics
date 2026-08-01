import * as zod from 'zod';
import { getProviderById } from '../constants/provider.js';
import { checkWithZod } from './zod.js';

export interface ProviderValidatorInput {
  clientId: string;
  clientSecret: string;
  provider: string;
  data?: { name?: string; [key: string]: any };
}

// const ProviderValidator = ({
//   clientId,
//   clientSecret,
//   provider,
//   data = {},
// }: ProviderValidatorInput): string | false => {
//   if (!clientId) {
//     return 'Client ID is required';
//   }

//   if (!clientSecret) {
//     return 'Client Secret is required';
//   }

//   if (!provider || !getProviderById(provider)) {
//     return 'Please provide a valid provider ID';
//   }

//   if (provider === 'custom') {
//     if (!data?.name) {
//       return 'Please provide a name for the custom provider';
//     }
//   }

//   return false;
// };

const zodProviderValidator = zod
  .object({
    clientId: zod.string().min(1, 'common.error.clientIdRequired'),
    clientSecret: zod.string().min(1, 'common.error.clientSecretRequired'),
    provider: zod.string().refine((value) => !!getProviderById(value), {
      message: 'common.error.invalidProviderId',
    }),
    data: zod
      .object({
        name: zod.string().min(1, 'common.error.customProviderNameRequired'),
      })
      .optional(),
  })
  .superRefine((value, ctx) => {
    const provider = getProviderById(value.provider);

    if (provider?.id === 'custom') {
      if (!value.data?.name) {
        ctx.addIssue({
          code: 'invalid_type',
          expected: 'string',
          path: ['data', 'name'],
          message: 'common.error.customProviderNameRequired',
        });
      }
    }
  });

export const ProviderValidator = (input: ProviderValidatorInput) =>
  checkWithZod(zodProviderValidator, input);

export default ProviderValidator;
