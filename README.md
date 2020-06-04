<p align="center">
  <a href="https://github.com/artemirq/zero-scripts" target="blank">
    <img width="296" alt="Zero Scripts Logo" src="https://user-images.githubusercontent.com/17342159/63062152-7f68f180-bf00-11e9-9da5-f02c66134533.png">
  </a>
</p>

<p align="center">A modular approach to develop modern JavaScript projects with minimal configuration.</p>

<a href="https://www.npmjs.com/~zero-scripts"><img src="https://img.shields.io/npm/v/@zero-scripts/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~zero-scripts"><img src="https://img.shields.io/npm/dm/@zero-scripts/core.svg" alt="NPM Downloads" /></a>
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)
<a href="https://www.npmjs.com/~zero-scripts"><img src="https://img.shields.io/npm/l/@zero-scripts/core.svg" alt="Package License" /></a>
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg)](https://github.com/artemirq/zero-scripts/pulls)

## About

The main idea of project is resolve the inconvenience on using popular tools, on use which creates large and complex configurations. Supporting and extending such configurations it is a chore work.

## Highlights

- #### ⏱ Zero Configuration

Make things faster without worrying about configuration. At default, we ship all modern features and best practices.

---

- #### ⚡ Modular Extensions

Extensions is a ["pluggable"](packages/core#process-of-loading-extensions) packages. To add a feature you need only add package to `devDependencies`. Unused packages will not be installed.

---

- #### ⚙ Customization

Extensions have [set of options](packages/core#passing-options). It allows for extend configurations for your requirements.

## Guide

Firstly you need to choose basic preset, which contain necessary scripts for your project.

### Getting started with React

This preset include all required features for most React projects.<br>

However you can go with [flexible way](#getting-started-with-react-flexible-way) and choose the necessary functions yourself.

#### yarn

```
yarn add @zero-scripts/preset.webpack-spa.react
```

#### npm

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

### Getting started with React (flexible way)

```
yarn add @zero-scripts/preset.webpack-spa
```

#### Babel

`required`

```
yarn add @zero-scripts/extension.webpack-babel.react
```

#### ESLint

```
yarn add @zero-scripts/extension.webpack-eslint.react
```

#### CSS

```
yarn add @zero-scripts/extension.webpack-css
```

#### Sass

```
yarn add @zero-scripts/extension.webpack-sass
```

#### PWA

```
yarn add @zero-scripts/extension.webpack-pwa
```

## Packages

### Presets

- #### [@zero-scripts/preset.webpack-spa](packages/preset.webpack-spa)
- #### [@zero-scripts/preset.webpack-spa.react](packages/preset.webpack-spa.react)

### Extensions

- #### [@zero-scripts/extension.webpack-babel](packages/extension.webpack-babel)
- #### [@zero-scripts/extension.webpack-babel.react](packages/extension.webpack-babel.react)
- #### [@zero-scripts/extension.webpack-css](packages/extension.webpack-css)
- #### [@zero-scripts/extension.webpack-sass](packages/extension.webpack-sass)
- #### [@zero-scripts/extension.webpack-eslint](packages/extension.webpack-eslint)
- #### [@zero-scripts/extension.webpack-eslint.react](packages/extension.webpack-eslint.react)
- #### [@zero-scripts/extension.webpack-pwa](packages/extension.webpack-pwa)
- #### [@zero-scripts/extension.webpack-spa](packages/extension.webpack-babel)

### Configuration builders

- #### [@zero-scripts/config.webpack](packages/config.webpack)

## [Comparison](COMPARISON.md) with alternatives

## License

Zero Scripts has [MIT license](./LICENSE)
