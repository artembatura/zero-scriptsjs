require('./eslint-patch');

module.exports = global['ESLINT_CONFIG'] || {};
