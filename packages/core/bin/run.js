#!/usr/bin/env node

const { run } = require('@zero-scripts/core');

run(process.argv.slice(2));

process.on('unhandledRejection', err => {
  // eslint-disable-next-line no-console
  console.log(err.stack || err.stackTrace);
});
