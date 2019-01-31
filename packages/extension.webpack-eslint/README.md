# @zero-scripts/extension.webpack-eslint

## Description

Adds processing JavaScript code with ESLint

## Installation

##### yarn

```
yarn add -D @zero-scripts/extension.webpack-eslint
```

##### npm

```
npm i -D @zero-scripts/extension.webpack-eslint
```

## Options

| Option  | Type                           | Default |
| ------- | ------------------------------ | ------- |
| plugins | _string[]_                     | `[]`    |
| extends | _string[]_                     | `[]`    |
| rules   | _{ [string]: string / any[] }_ | `{}`    |
| env     | _{ [string]: boolean }_        | `{}`    |

## Usage

```
{
  "devDependencies": {
    // <- preset, which uses @zero-scripts/config.webpack

    "@zero-scripts/extension.webpack-eslint": "latest"
  }
}
```
