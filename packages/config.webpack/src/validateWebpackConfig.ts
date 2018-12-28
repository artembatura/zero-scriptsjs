import { Configuration } from 'webpack';

const validateSchema = require('webpack/lib/validateSchema');
const WebpackOptionsValidationError = require('webpack/lib/WebpackOptionsValidationError');
const webpackOptionsSchema = require('webpack/schemas/WebpackOptions.json');

export const validateWebpackConfig = (
  options: Configuration
): Configuration => {
  const webpackOptionsValidationErrors = validateSchema(
    webpackOptionsSchema,
    options
  );

  if (webpackOptionsValidationErrors.length) {
    throw new WebpackOptionsValidationError(webpackOptionsValidationErrors);
  }

  return options;
};
