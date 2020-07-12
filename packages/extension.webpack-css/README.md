# @zero-scripts/extension.webpack-css

Extract, minify and add vendor prefixes.

## Installation

##### yarn

```
yarn add -D @zero-scripts/extension.webpack-css
```

##### npm

```
npm i -D @zero-scripts/extension.webpack-css
```

## Options

| Option       | Type                                                                                | Default | Description              |
| ------------ | ----------------------------------------------------------------------------------- | ------- | ------------------------ |
| styleLoaders | _Array<{ test: string; loader: string; exclude?: string; preprocessor?: string; }>_ | `[]`    | Additional style loaders |

## Usage

```
{
  "devDependencies": {
    // <- preset, which uses @zero-scripts/config.webpack

    "@zero-scripts/extension.webpack-css": "latest"
  }
}
```
