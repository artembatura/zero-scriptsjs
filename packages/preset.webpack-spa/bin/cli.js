#!/usr/bin/env node

const { runCLI } = require('@zero-scripts/core');

const { WebpackPresetSpa } = require('../build');

process.on('unhandledRejection', err => {
  throw err;
});

runCLI(WebpackPresetSpa);
