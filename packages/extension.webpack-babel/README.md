# @zero-scripts/extension.webpack-babel

## Description

Adds processing JavaScript code with Babel

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

| Option  | Type       | Default | Description              |
| ------- | ---------- | ------- | ------------------------ |
| plugins | _string[]_ | `[]`    | Additional Babel plugins |
| presets | _string[]_ | `[]`    | Additional Babel presets |
| flow    | _boolean_  | `false` | Enable Flow support      |

Warning about TypeScript. If you want to enable check types on your TypeScript files,
you just need to install `fork-ts-checker-webpack-plugin` in your project

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
