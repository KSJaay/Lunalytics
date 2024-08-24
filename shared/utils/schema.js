function checkObjectAgainstSchema(object, schema) {
  for (const key in object) {
    // If key doesn't exist then throw an error

    if (!schema?.hasOwnProperty(key)) {
      throw new Error('Invalid key provided: ' + key);
    } else {
      const requirements = schema[key];
      const data = object[key];

      if (requirements._type === 'object' || requirements._type === 'array') {
        if (Array.isArray(data)) {
          if (!requirements._keys) {
            if (requirements._validate && !requirements._validate(data)) {
              throw new Error('Unable to validate key: ' + key);
            }
          } else {
            checkArrayAgainstSchema(data, requirements._keys);
          }
        } else {
          checkObjectAgainstSchema(data, requirements._keys);
        }
      } else if (typeof data === requirements._type) {
        if (requirements._validate && !requirements._validate(data)) {
          throw new Error('Unable to validate key: ' + key);
        }
      } else {
        throw new Error('Invalid key type: ' + key);
      }
    }
  }

  return true;
}

function checkArrayAgainstSchema(objArr, schema) {
  return objArr.map((obj) => checkObjectAgainstSchema(obj, schema));
}

export { checkArrayAgainstSchema, checkObjectAgainstSchema };
