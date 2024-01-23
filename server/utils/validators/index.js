const auth = require('./auth');
const monitor = require('./monitor');
const user = require('./user');

const validators = { auth, monitor, user };

module.exports = validators;
