import { ObjectSchemaValidatorError } from './errors.js';

function checkObjectAgainstSchema(object, schema, fullKey = '') {
  for (const key in object) {
    // If key doesn't exist then throw an error

    const nextFullKey = !fullKey ? key : `${fullKey}.${key}`;

    if (!schema?.hasOwnProperty(key)) {
      throw new ObjectSchemaValidatorError(
        'Invalid key provided: ' + nextFullKey
      );
    } else {
      const requirements = schema[key];
      const data = object[key];

      if (requirements._required && typeof data === 'undefined') {
        throw new ObjectSchemaValidatorError('Key is required: ' + nextFullKey);
      }

      if (requirements._type === 'object' || requirements._type === 'array') {
        if (Array.isArray(data)) {
          if (!requirements._keys) {
            if (requirements._validate && !requirements._validate(data)) {
              throw new ObjectSchemaValidatorError(
                'Unable to validate key: ' + nextFullKey
              );
            }
          } else {
            if (requirements._strictMatch) {
              const schemaKeys = Object.keys(requirements._keys);

              data.forEach((item) => {
                const dataKeys = Object.keys(item);

                schemaKeys.forEach((key) => {
                  if (!dataKeys.includes(key)) {
                    throw new ObjectSchemaValidatorError(
                      'Missing key: ' + nextFullKey
                    );
                  }
                });
              });
            }

            checkArrayAgainstSchema(data, requirements._keys, nextFullKey);
          }
        } else {
          if (requirements._strictMatch) {
            const schemaKeys = Object.keys(requirements._keys);
            const dataKeys = Object.keys(data);

            schemaKeys.forEach((key) => {
              if (!dataKeys.includes(key)) {
                throw new ObjectSchemaValidatorError(
                  'Missing key: ' + nextFullKey
                );
              }
            });
          }

          checkObjectAgainstSchema(data, requirements._keys, nextFullKey);
        }
      } else if (typeof data === requirements._type) {
        if (requirements._validate && !requirements._validate(data)) {
          throw new ObjectSchemaValidatorError(
            'Unable to validate key: ' + nextFullKey
          );
        }
      } else {
        throw new ObjectSchemaValidatorError(
          'Invalid key type: ' + nextFullKey
        );
      }
    }
  }

  return true;
}

function checkArrayAgainstSchema(objArr, schema, fullKey) {
  return objArr.map((obj, index) =>
    checkObjectAgainstSchema(obj, schema, fullKey + `[${index}]`)
  );
}

export { checkArrayAgainstSchema, checkObjectAgainstSchema };
