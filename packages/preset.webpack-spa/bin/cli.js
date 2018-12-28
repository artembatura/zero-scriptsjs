#!/usr/bin/env node

const { runCLI } = require('@zero-scripts/core');
const { WebpackPresetWeb } = require('../build');

runCLI(WebpackPresetWeb);
