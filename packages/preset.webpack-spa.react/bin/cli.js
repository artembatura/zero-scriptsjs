#!/usr/bin/env node

const { runCLI } = require('@zero-scripts/core');
const {
  WebpackSpaReactPreset
} = require('@zero-scripts/preset.webpack-spa.react');

process.on('unhandledRejection', err => {
  throw err;
});

runCLI(WebpackSpaReactPreset);
