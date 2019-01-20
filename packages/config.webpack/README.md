# @zero-scripts/config.webpack

## Description

Configuration for Webpack

## Options

| Option    | Type      | Default |
| --------- | --------- | ------- |
| sourceMap | _Boolean_ | `true`  |
| additionalEntry | _Array_ | `[]` |
| moduleFileExtensions | _Array_ | `[]` |
| jsFileExtensions | _Array_ | `[]` |
| paths | _Object_ | |
| paths.root | _String_ | ` ` |
| paths.src | _String_ | `src` |
| paths.build | _String_ | `build` |
| paths.indexJs | _String_ | `src/index` |
| paths.indexHtml | _String_ | `public/index.html` |
| paths.public | _String_ | `public` |

## Passing options

### Example

Turn off source maps

#### `package.json`

```
{
  ...
  "zero-scripts": {
    "@zero-scripts/config.webpack": {
      "sourceMap": false
    }
  }
}
```

### Example

Sources are in root directory

#### `package.json`

```
{
  ...
  "zero-scripts": {
    "@zero-scripts/config.webpack": {
      "paths": {
         "src": "",
         "indexJs": "index"
      }
    }
  }
}
```
