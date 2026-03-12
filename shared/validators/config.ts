import * as zod from 'zod';
import { checkWithZod } from './zod.js';

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
