# @zero-scripts/extension.webpack-babel.react

Inherited from [@zero-scripts/extension.webpack-babel](../extension.webpack-babel)

## Description

Add processing JavaScript code with Babel

## Installation

##### yarn

```
yarn add -D @zero-scripts/extension.webpack-babel.react
```

##### npm

```
npm i -D @zero-scripts/extension.webpack-babel.react
```

## Options

| Option     | Type       | Default | Description                     |
| ---------- | ---------- | ------- | ------------------------------- |
| plugins    | _string[]_ | `[]`    | Additional Babel plugins        |
| presets    | _string[]_ | `[]`    | Additional Babel presets        |
| typescript | _boolean_  | `false` | Enable TypeScript support       |
| flow       | _boolean_  | `false` | Strip Flow type annotations     |
| propTypes  | _boolean_  | `false` | Strip PropTypes in `production` |

Warning about TypeScript: If you want to checking types on your TypeScript files,
you need to manually install `fork-ts-checker-webpack-plugin`

## Usage

```
{
  "devDependencies": {
    // <- preset, which uses @zero-scripts/config.webpack

    "@zero-scripts/extension.webpack-babel.react": "latest"
  }
}
```
