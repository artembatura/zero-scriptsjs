# @zero-scripts/preset.webpack-spa

## Description

For development Single Page Applications

## Scripts

- ### `start`

  Runs the app in development mode

- ### `build`

  Builds the app for production to the `build` folder

## Installation

##### yarn

```
yarn add -D @zero-scripts/preset.webpack-spa
```

##### npm

```
npm i -D @zero-scripts/preset.webpack-spa
```

## Usage

```
{
  "scripts": {
    "development": "webpack-spa start",
    "production": "webpack-spa build"
  },
  "devDependencies": {
    "@zero-scripts/preset.webpack-spa": "latest"
  }
}
```

## Examples

- #### [React](../../examples/react)
- #### [React TypeScript](../../examples/react-typescript)
