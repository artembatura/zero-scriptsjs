<p align="center">
  <a href="https://github.com/artemirq/zero-scripts" target="blank">
    <img src="https://svgshare.com/i/A_0.svg" width="320" alt="Zero Scripts Logo" />
  </a>
</p>

<p align="center">A new approach to modular development modern JavaScript projects without configuration</p>

<a href="https://www.npmjs.com/~zero-scripts"><img src="https://img.shields.io/npm/v/@zero-scripts/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~zero-scripts"><img src="https://img.shields.io/npm/dm/@zero-scripts/core.svg" alt="NPM Downloads" /></a>
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)
<a href="https://www.npmjs.com/~zero-scripts"><img src="https://img.shields.io/npm/l/@zero-scripts/core.svg" alt="Package License" /></a>
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg)](https://github.com/artemirq/zero-scripts/pulls)

## Description

The main idea of project is resolve the inconvenience on using popular tools, on use which creates large and complex configurations. Supporting and extending such configuration it is a chore work

## Features

- ⏱ **Zero Configuration:** Make things faster without worrying about configuration

- 🔥 **Modular:** Additional feature should be provided as separated extension package. No unused packages not be installed

- ⚡ **Extensible:** Extensions is a ["pluggable"](packages/core#process-of-loading-extensions) packages. To add a feature you need only install extension to `devDependencies`

- 🛠 **Universal:** The project created not only for concrete tool or framework and can be used for any JavaScript tool

- ⚙ **Customizable:** Use the [availability](packages/core#passing-options) of providing options to configurations and extensions in `package.json`

## Packages

### Webpack

#### Presets

Package | Developing
------- | -----------
[preset.webpack-spa](packages/preset.webpack-spa) | Single-page applications
preset.webpack-ssr | Server-side Rendering applications
preset.webpack-node | Node.js applications

#### Extensions

Package | Adds
------- | -----------
[extension.webpack-babel](packages/extension.webpack-babel) | Processing JavaScript code with Babel
[extension.webpack-babel.react](packages/extension.webpack-babel.react) | JSX support. Inherited from `extension.webpack-babel`
[extension.webpack-css](packages/extension.webpack-css) | Processing CSS: extracting, minify and add vendor prefixes
[extension.webpack-sass](packages/extension.webpack-sass) | Same as `extension.webpack-css`, but for Sass/SCSS
[extension.webpack-eslint](packages/extension.webpack-eslint) | Processing JavaScript code with ESLint

#### Configs

Package | Base configuration for
------- | -----------
[config.webpack](packages/config.webpack) | Webpack 

## [Comparison](COMPARISON.md)

## [Contributing](CONTRIBUTING.md)

## License

Zero Scripts is [MIT licensed](./LICENSE)
