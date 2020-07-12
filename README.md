<p align="center">A modular approach to develop modern JavaScript projects with minimal configuration.</p>

<a href="https://www.npmjs.com/~zero-scripts"><img src="https://img.shields.io/npm/v/@zero-scripts/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~zero-scripts"><img src="https://img.shields.io/npm/dm/@zero-scripts/core.svg" alt="NPM Downloads" /></a>
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)
<a href="https://www.npmjs.com/~zero-scripts"><img src="https://img.shields.io/npm/l/@zero-scripts/core.svg" alt="Package License" /></a>
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg)](https://github.com/artemirq/zero-scripts/pulls)

- [About](#about)
- [Highlights](#highlights)
- [Why?](#why)
- [How it works?](#how-it-works)
  - [Process of loading extensions](#process-of-loading-extensions)
  - [Passing options](#passing-options)
- [Getting started](#getting-started)
  - **[Getting started with React](#getting-started-with-react)**
  - **[Getting started with SPA](#getting-started-with-spa)**
    - [Adding Babel](#adding-babel)
    - [Adding Babel (React)](#adding-babel-react)
    - [Adding ESLint](#adding-eslint)
    - [Adding ESLint (React)](#adding-eslint-react)
    - [Adding CSS](#adding-css)
    - [Adding Sass](#adding-sass)
    - [Adding PWA capabilities](#adding-pwa-capabilities)
- Examples
  - [React](examples/react)
  - [React w/ TypeScript](examples/react-typescript)
  - [React w/ Astroturf](examples/react-astroturf)
- [Comparison with alternatives](#comparison-with-alternatives)
- [License](#license)

# About

This project is attempt to combine task manager, configuration management facilities and extension system into one solution to simplify configuring development processes on building applications.

We provide an ecosystem of ready packages for development modern JavaScript projects (based on Webpack, but not limited to it).

# Highlights

- ### ⏱ Zero Configuration

Make things faster without worrying about configuration. We ship a reasonably good configuration and modern features at default.

---

- ### ⚡ Extensible & Modular

Extensions is a ["pluggable"](#process-of-loading-extensions) packages. To add a feature you need only add package to `devDependencies`.

_Big part of unused packages will not be installed, because you choose what you needed._

---

- ### ⚙ Customizable

Extensions and configurations have own [set of options](#passing-options). It's allow modifying everything for your requirements.

# Why?

**Most of popular bundlers doesn't ship configuration management facilities**. As result supporting and extending complex configurations it is a chore work in every project.

We know popular tools which solve this problem: CRA, Vue CLI and other. **Projects like this was created to simplify development only for specific projects and do not combine the best among themselves**.

CRA is not extensible out of the box and ship all features even if you don't need. You can eject CRA, but you will lose all advantages, and you will need to support configuration yourself.

# How it works?

**Preset** is a base package which contain scripts and [loads](#process-of-loading-extensions) extensions.

**Extension** is an additional package, which complements preset and can add more scripts or extend a bundler configuration.

## Process of loading extensions

Extensions will be all packages, which defined in `devDependencies` and match pattern `extension\\.[a-z]*`.

These packages will be automatically loaded and applied by preset.

### Example

Adding Babel

```diff
{
 "devDependencies": {
   "@zero-scripts/preset.webpack-spa": "^0.5.0",
+  "@zero-scripts/extension.webpack-babel": "^0.5.0"
 }
}
```

## Passing options

You can pass options to config or extension in package.json file using `zero-scripts` field

### Example

Adding support for [Astroturf](https://github.com/4Catalyzer/astroturf)

```diff
{
  "dependencies": {
    "react": "16.13.1",
    "react-dom": "16.13.1",
+   "astroturf": "0.10.4"
  },
  "devDependencies": {
    "@zero-scripts/preset.webpack-spa.react": "^0.5.0"
  },
+ "zero-scripts": {
+   "extension.webpack-babel.react": {
+     "jsLoaders": [
+       {
+         "loader": "astroturf/loader",
+         "options": {
+           "extension": ".astro.css"
+         }
+       }
+     ]
+   },
+   "extension.webpack-css": {
+     "styleLoaders": [
+       {
+         "test": "\\.astro.css",
+         "loader": "astroturf/css-loader"
+       }
+     ]
+   }
+ }
}
```

# Getting Started

At start, you need to choose basic preset, which contain necessary scripts. Then you can install extensions, which adds extra features for your project.

## Getting started with React

This preset includes all required features for the most React projects.<br>

This is the fastest way to get started with React, but you can go with more [flexible way](#getting-started-with-spa) and choose the necessary functions yourself.

#### [`More info`](./packages/preset.webpack-spa.react)

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

#### [`More info`](./packages/preset.webpack-spa)

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
yarn add @zero-scripts/extension.webpack-babel
```

#### npm

```
npm i @zero-scripts/extension.webpack-babel
```

#### [`More info`](./packages/extension.webpack-babel)

### Adding Babel (React)

#### yarn

```
yarn add @zero-scripts/extension.webpack-babel.react
```

#### npm

```
npm i @zero-scripts/extension.webpack-babel.react
```

#### [`More info`](./packages/extension.webpack-babel.react)

### Adding ESLint

#### yarn

```
yarn add @zero-scripts/extension.webpack-eslint
```

#### npm

```
npm i @zero-scripts/extension.webpack-eslint
```

#### [`More info`](./packages/extension.webpack-eslint)

### Adding ESLint (React)

#### yarn

```
yarn add @zero-scripts/extension.webpack-eslint.react
```

#### npm

```
npm i @zero-scripts/extension.webpack-eslint.react
```

#### [`More info`](./packages/extension.webpack-eslint.react)

### Adding CSS

#### yarn

```
yarn add @zero-scripts/extension.webpack-css
```

#### npm

```
npm i @zero-scripts/extension.webpack-css
```

#### [`More info`](./packages/extension.webpack-css)

### Adding Sass

#### yarn

```
yarn add @zero-scripts/extension.webpack-sass
```

#### npm

```
npm i @zero-scripts/extension.webpack-sass
```

#### [`More info`](./packages/extension.webpack-sass)

### Adding PWA capabilities

#### yarn

```
yarn add @zero-scripts/extension.webpack-pwa
```

#### npm

```
npm i @zero-scripts/extension.webpack-pwa
```

#### [`More info`](./packages/extension.webpack-pwa)

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
