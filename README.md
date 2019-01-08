<p align="center">
  <a href="https://github.com/artemirq/zero-scripts" target="blank">
    <img src="https://svgshare.com/i/APg.svg" width="320" alt="Zero Scripts Logo" />
  </a>
</p>

<p align="center">Development modern JavaScript projects without configuration</p>

<a href="https://www.npmjs.com/~zero-scripts"><img src="https://img.shields.io/npm/v/@zero-scripts/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~zero-scripts"><img src="https://img.shields.io/npm/dm/@zero-scripts/core.svg" alt="NPM Downloads" /></a>
<a href="https://www.npmjs.com/~zero-scripts"><img src="https://img.shields.io/npm/l/@zero-scripts/core.svg" alt="Package License" /></a>
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg)](https://github.com/artemirq/zero-scripts/pulls)

## Description

The main idea of the project — resolve the inconvenience on using popular tools, on use which creates large and complex configurations. To support and expand such configuration it is a chore work

Exists many projects, which tries to resolve this problem. Mainly these projects aimed for concrete building tool (Neutrino - Webpack) or what worse, to use with concrete JS framework (react-scripts - React). The main drawback in most projects, what you cannot extend configurations with these tools and you cannot control, which features shipped with tool

Zero Scripts can't aimed to concrete tool, framework or something else. You can use Zero Scripts to build libraries, or at all use for your peculiar target. You can use Zero Scripts in your monorepo to build own presets, extensions and configurations

Modular Extensions System allow using extensions as Plug-and-Play (it's not about Yarn) packages. To activate extension you need only add it's to your `devDependencies` 🔥

## Philosophy

- **Modular Extensions System:** Additional feature should be provided as separated extension package. You can always be sure that no unused packages will be can't installed

- **Zero-Configuration:** Development applications without configuration. Just choose a preset, need extensions and start developing!

- **Power of customizing:** Use the opportunity of providing options to configurations and extensions by `package.json`

## Package Types

- **Preset**. It's a set of scripts and CLI to launch their

- **Extension**. Adds scripts to preset and extends configuration

- **Config**. Convenient API for extend configuration

## Packages

### Presets

> #### [webpack-spa](packages/preset.webpack-spa)
> **Build and develop Single Page Applications**

### Extensions

* #### [webpack-babel](packages/extension.webpack-babel)
* #### [webpack-babel.react](packages/extension.webpack-babel.react)
* #### [webpack-css](packages/extension.webpack-css)
* #### [webpack-eslint](packages/extension.webpack-eslint)

### Configs

* #### [config.webpack](packages/config.webpack)

## Future

At this moment status of this project is — working conception

Near future: finalize Core API and create more extensions for `webpack-spa`

Distant future: create presets for building other types of applications or libraries (maybe `preset.rollup.lib`?)

## License

Zero Scripts is [MIT licensed](./LICENSE)
