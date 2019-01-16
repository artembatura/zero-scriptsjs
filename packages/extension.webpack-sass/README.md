# @zero-scripts/extension.webpack-sass

## Description

Add processing Sass and SCSS files: extracting, minify and add vendor prefixes

Uses [@zero-scripts/config.webpack](../config.webpack)

## Features

- [style-loader](https://github.com/webpack-contrib/style-loader) on `development`
- [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) on `production`
- [postcss-loader](https://github.com/postcss/postcss-loader)
- [css-loader](https://github.com/webpack-contrib/css-loader)
  - [css-modules](https://github.com/css-modules/css-modules) for `*.module.css`
- [sass-loader](https://github.com/webpack-contrib/sass-loader)

## Installation

##### yarn

```
yarn add -D @zero-scripts/extension.webpack-sass
```

##### npm

```
npm i -D @zero-scripts/extension.webpack-sass
```

## Usage

```
{
  "devDependencies": {
    // <- preset, which uses @zero-scripts/config.webpack

    "@zero-scripts/extension.webpack-sass": "latest"
  }
}
```
