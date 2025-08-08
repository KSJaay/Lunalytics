const ConfigValidator = ({ nativeSignin, register }) => {
  const data = {};

  if (typeof nativeSignin !== 'boolean') {
    return 'Invalid value for nativeSignin';
  } else {
    data.register = register;
  }

  if (typeof register !== 'boolean') {
    return 'Invalid value for register';
  } else {
    data.register = register;
  }

  return data;
};

export default ConfigValidator;
