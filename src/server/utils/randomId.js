const { customAlphabet } = require('nanoid');

const randomId = () => {
  // string containing all alphanumeric characters
  const alphaNumbericString = '0123456789abcdefghijklmnopqrstuvwxyz';
  const nanoid = customAlphabet(alphaNumbericString, 16);

  return nanoid();
};

module.exports = randomId;
