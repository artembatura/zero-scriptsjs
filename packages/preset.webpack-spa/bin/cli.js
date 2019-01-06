#!/usr/bin/env node

const { runCLI } = require('@zero-scripts/core');
const { WebpackPresetWeb } = require('../build');

process.on('unhandledRejection', err => {
  throw err;
});

runCLI(WebpackPresetWeb);
