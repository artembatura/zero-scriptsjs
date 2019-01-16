# @zero-scripts/extension.webpack-babel

## Description

Add processing JavaScript code with Babel

Uses [@zero-scripts/config.webpack](../config.webpack)

## Features

- [@babel/core](https://babeljs.io/docs/en/next/babel-core.html)
- [@babel/preset-env](https://babeljs.io/docs/en/next/babel-preset-env.html)
- [babel-loader](https://github.com/babel/babel-loader)

## Installation

##### yarn

```
yarn add -D @zero-scripts/extension.webpack-babel
```

##### npm

```
npm i -D @zero-scripts/extension.webpack-babel
```

## Options

| Option     | Type       | Default | Description               |
| ---------- | ---------- | ------- | ------------------------- |
| presets    | _string[]_ | `[]`    | Additional babel presets  |
| typescript | _boolean_  | `false` | Enable Typescript support |

Warning: If you want to checking types on your Typescript files,
you need to manually install `fork-ts-checker-webpack-plugin`

## Usage

```
{
  "devDependencies": {
    // <- preset, which uses @zero-scripts/config.webpack

    "@zero-scripts/extension.webpack-babel": "latest"
  },
  "zero-scripts": {
    "@zero-scripts/extension.webpack-babel": {
      "presets": ["@babel/preset-*"]
    }
  }
}
```
