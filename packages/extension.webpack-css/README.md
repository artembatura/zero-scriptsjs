# @zero-scripts/extension.webpack-css

## Features

- [style-loader](https://github.com/webpack-contrib/style-loader) on `development`
- [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) on `production`
- [postcss-loader](https://github.com/postcss/postcss-loader)
- [css-loader](https://github.com/webpack-contrib/css-loader)
   - [css-modules](https://github.com/css-modules/css-modules) for `*.module.css`

## Usage

```
{
  "devDependencies": {
    // here a preset, which uses @zero-scripts/config.webpack

    "@zero-scripts/extension.webpack-css": "latest"
  }
}
```
