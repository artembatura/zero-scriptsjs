# @zero-scripts/extension.webpack-babel

Adds Babel to `@zero-scripts/config.webpack`

## Options

| Option  | Type       | Default |
| ------- | ---------- | ------- |
| presets | _string[]_ | `[]`    |

## Example

`package.json`

```json
{
  "devDependencies": {
    "@zero-scripts/preset.webpack-spa": "latest",
    "@zero-scripts/extension.webpack-babel": "latest"
  },
  "zero-scripts": {
    "@zero-scripts/extension.webpack-babel": {
      "presets": ["@babel/preset-react"]
    }
  }
}
```
