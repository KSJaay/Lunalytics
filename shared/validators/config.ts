import * as zod from 'zod';
import { is } from 'zod/v4/locales';
import { checkWithZod } from './zod';

export interface ConfigValidatorInput {
  nativeSignin?: boolean;
  register?: boolean;
}

export interface ConfigValidatorOutput {
  nativeSignin?: boolean;
  register?: boolean;
}

const zodConfigValidator = zod.object({
  nativeSignin: zod
    .boolean('common.error.configNativeSigninInvalid')
    .optional()
    .default(false),
  register: zod
    .boolean('common.error.configRegisterInvalid')
    .optional()
    .default(false),
});

const ConfigValidator = ({
  nativeSignin,
  register,
}: ConfigValidatorInput): ConfigValidatorOutput | string =>
  checkWithZod(zodConfigValidator, { nativeSignin, register });

export default ConfigValidator;
