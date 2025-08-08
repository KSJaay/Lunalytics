const ConfigValidator = ({ nativeSignin, register }) => {
  const data = {};

  if (!!nativeSignin && typeof nativeSignin !== 'boolean') {
    return 'Invalid value for nativeSignin';
  } else {
    data.nativeSignin = nativeSignin;
  }

  if (!!register && typeof register !== 'boolean') {
    return 'Invalid value for register';
  } else {
    data.register = register;
  }

  return data;
};

export default ConfigValidator;
