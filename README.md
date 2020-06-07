<p align="center">A modular approach to develop modern JavaScript projects with minimal configuration.</p>

<a href="https://www.npmjs.com/~zero-scripts"><img src="https://img.shields.io/npm/v/@zero-scripts/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~zero-scripts"><img src="https://img.shields.io/npm/dm/@zero-scripts/core.svg" alt="NPM Downloads" /></a>
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)
<a href="https://www.npmjs.com/~zero-scripts"><img src="https://img.shields.io/npm/l/@zero-scripts/core.svg" alt="Package License" /></a>
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg)](https://github.com/artemirq/zero-scripts/pulls)

- [About](#about)
- [Why?](#why)
- [Highlights](#highlights)
- [Guide](#guide)
  - [Getting started with React](#getting-started-with-react)
  - [Getting started with SPA](#getting-started-with-spa)
    - [Adding Babel](#adding-babel)
    - [Adding Babel (React)](#adding-babel-react)
    - [Adding ESLint](#adding-eslint)
    - [Adding ESLint (React)](#adding-eslint-react)
    - [Adding CSS](#adding-css)
    - [Adding Sass](#adding-sass)
    - [Adding PWA capabilities](#adding-pwa-capabilities)
- [Comparison with alternatives](#comparisoncomparisonmd-with-alternatives)
- [License](#license)

# About

This project is attempt to combine task manager, configuration management facilities and plugin system into one solution to simplify configuring development processes on building applications.

# Highlights

- ### ⏱ Zero Configuration

Make things faster without worrying about configuration. We ship a reasonably good configuration and modern features at default.

---

- ### ⚡ Extensible & Modular

Package plugin system. Extensions is a ["pluggable"](packages/core#process-of-loading-extensions) packages. To add a feature you need only add package to `devDependencies`.

_Most unused packages will not be installed, because you choose what you needed._

---

- ### ⚙ Customizable

Extensions have a [set of options](packages/core#passing-options). It allows modifying configurations for your requirements.

# Why?

**Most of popular bundlers doesn't ship configuration management facilities**. As result supporting and extending complex configurations it is a chore work in every project.

We know popular tools which solve this problem. For example CRA, Vue CLI and other. **These tools was created to simplify development only for specific projects and do not combine the best among themselves**.

Also, CRA is not extensible out of the box and ship everything even if you don't need some features. You can eject CRA, but you will lose all advantages, and you will need to support configuration yourself.

# How it works?

# Guide

At start, you need to choose basic preset, which contain necessary scripts. Then you can add extensions, which adds necessary functions for your project.

## Getting started with React

This preset includes all required features for most React projects.<br>

This is the fastest way to get started with React, but you can go with more [flexible way](#getting-started-with-spa) and choose the necessary functions yourself.

### yarn

```
yarn add @zero-scripts/preset.webpack-spa.react
```

### npm

```
npm i @zero-scripts/preset.webpack-spa.react
```

### `npm run start` or `yarn start`

Runs the app in development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will automatically reload if you make changes to the code.<br>
You will see the build errors and lint warnings in the console.

### `npm run build` or `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>

Your app is ready to be deployed.

## Getting started with SPA

Basically this way intended to use without any framework. However, you can extend preset with extensions.

### yarn

```
yarn add @zero-scripts/preset.webpack-spa
```

### npm

```
npm i @zero-scripts/preset.webpack-spa
```

### `npm run start` or `yarn start`

Runs the app in development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will automatically reload if you make changes to the code.<br>
You will see the build errors and lint warnings in the console.

### `npm run build` or `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>

Your app is ready to be deployed.

### Adding Babel

#### yarn

```
yarn add @zero-scripts/preset.webpack-babel
```

#### npm

```
npm i @zero-scripts/preset.webpack-babel
```

### Adding Babel (React)

#### yarn

```
yarn add @zero-scripts/preset.webpack-babel.react
```

#### npm

```
npm i @zero-scripts/preset.webpack-babel.react
```

### Adding ESLint

#### yarn

```
yarn add @zero-scripts/preset.webpack-eslint
```

#### npm

```
npm i @zero-scripts/preset.webpack-eslint
```

### Adding ESLint (React)

#### yarn

```
yarn add @zero-scripts/preset.webpack-eslint.react
```

#### npm

```
npm i @zero-scripts/preset.webpack-eslint.react
```

### Adding CSS

#### yarn

```
yarn add @zero-scripts/preset.webpack-css
```

#### npm

```
npm i @zero-scripts/preset.webpack-css
```

### Adding Sass

#### yarn

```
yarn add @zero-scripts/preset.webpack-sass
```

#### npm

```
npm i @zero-scripts/preset.webpack-sass
```

### Adding PWA capabilities

#### yarn

```
yarn add @zero-scripts/preset.webpack-pwa
```

#### npm

```
npm i @zero-scripts/preset.webpack-pwa
```

# What's next?

Currently, we have some plans to ship more presets and extensions for development server-side Node.js applications and Node.js/browser libraries.

If you like this project or you have some opinion, you can share it with us!

# Comparison with alternatives

| Project          | Modular                  | Zero Configuration       | Extensible               | Universal                | Customizable             | Scaffold Applications    |
| ---------------- | ------------------------ | ------------------------ | ------------------------ | ------------------------ | ------------------------ | ------------------------ |
| Zero Scripts     | <p align="center">✅</p> | <p align="center">✅</p> | <p align="center">✅</p> | <p align="center">✅</p> | <p align="center">✅</p> | <p align="center">❌</p> |
| Neutrino         | <p align="center">✅</p> | <p align="center">✅</p> | <p align="center">✅</p> | <p align="center">❌</p> | <p align="center">✅</p> | <p align="center">✅</p> |
| create-react-app | <p align="center">❌</p> | <p align="center">✅</p> | <p align="center">⚠</p>  | <p align="center">❌</p> | <p align="center">⚠</p>  | <p align="center">✅</p> |

## Features explanation

- **Modular**. Availability to install only used packages. Most of the popular alternatives install all dependencies no matter what you use. For example, CRA ships with ESLint/Babel/etc without the possibility of choosing what you needed.
- **Zero Configuration**. Project ships a reasonably good configuration at default. No additional configuration needed for the most projects.
- **Extensible**. Easy to add a required features by installing additional packages. Or extend it locally with special API.
- **Universal**. Project tied to concrete tool. For example, you cannot build ecosystem with Neutrino which will use Rollup as a bundler tool.
- **Customizable**. Easy to modify some parts of bundler configuration by passing options. For example, you need to add additional Babel plugin/loader to Webpack configuration.

# License

Zero Scripts has [MIT license](./LICENSE)
