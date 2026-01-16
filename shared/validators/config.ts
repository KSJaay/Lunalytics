export interface ConfigValidatorInput {
  nativeSignin?: boolean;
  register?: boolean;
}

export interface ConfigValidatorOutput {
  nativeSignin?: boolean;
  register?: boolean;
}

const ConfigValidator = ({
  nativeSignin,
  register,
}: ConfigValidatorInput): ConfigValidatorOutput | string => {
  const data: ConfigValidatorOutput = {};

  if (nativeSignin !== undefined && typeof nativeSignin !== 'boolean') {
    return 'Invalid value for nativeSignin';
  } else {
    data.nativeSignin = nativeSignin;
  }

  if (register !== undefined && typeof register !== 'boolean') {
    return 'Invalid value for register';
  } else {
    data.register = register;
  }

  return data;
};

export default ConfigValidator;
