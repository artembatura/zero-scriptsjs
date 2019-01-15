# @zero-scripts/core

## Description

Main API, on which all ecosystem built

## Loading an extensions

Extensions will be all packages, which are in `devDependencies` and match pattern `extension\\.[a-z]*`

These packages will be automatically loaded and activated by preset

### Example

Suppose, we need adding processing JavaScript code transpilation by Babel to our `preset.webpack-spa`:

```
{
   "devDependencies": {
      "@zero-scripts/preset.webpack-spa": "latest",
      "@zero-scripts/extension.webpack-babel": "latest"
   }
}
```

## Passing options

You can pass options for config/extension in package.json file by `zero-scripts` field

### Example

Suppose, we need add additional preset for `@zero-scripts/extension.webpack-babel`

```
{
   "zero-scripts": {
      "@zero-scripts/extension.webpack-babel": {
         "presets": [
            "@babel/preset-*"
         ]
      }
   }
}
```

## API

Not documented. We do not have stable version and API can change in any time. **Recommended learn API by examples**
