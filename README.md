<p align="center">
  <a href="https://github.com/artemirq/zero-scripts" target="blank">
    <img src="https://svgshare.com/i/AZ3.svg" width="320" alt="Zero Scripts Logo" />
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

- ⏱ **Zero Configuration:** Begin make things faster without worrying about configuration

- 🔥 **Modular:** Additional feature should be provided as separated extension package. You can always be sure that no unused packages will be can't installed

- ⚡ **Extensible:** Extensions is a [pluggable](packages/core#process-of-loading-extensions) packages. To add a feature you need only install extension to `devDependencies`

- 🛠 **Universal:** Project can't aimed only to concrete tool, framework or something else

- ⚙ **Customizable:** Use the [opportunity](packages/core#passing-options) of providing options to configurations and extensions by `package.json`

## [Comparison](COMPARISON.md) 🏆

## Getting started

1. Choose a [Preset](#preset) for your application type
2. Choose a need [extensions](#extension), if need features in Preset are missing
3. Start developing! =)

## Preset

**A set of scripts and CLI to launch their**

- ### [webpack-spa](packages/preset.webpack-spa)
   **Build and develop Single Page Applications**

## Extension

**Adds scripts to preset and can extends configuration**

* ### [webpack-babel](packages/extension.webpack-babel)
* ### [webpack-babel.react](packages/extension.webpack-babel.react)
* ### [webpack-css](packages/extension.webpack-css)
* ### [webpack-eslint](packages/extension.webpack-eslint)

## Config

**Initialize base configuration and contains API methods to extends their**

* ### [config.webpack](packages/config.webpack)

Note: This packages cannot need to install manually. It's used by presets and extensions

## License

Zero Scripts is [MIT licensed](./LICENSE)
