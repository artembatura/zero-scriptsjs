# @zero-scripts/config.webpack

Base configuration for Webpack

## Options

| Option    | Type      | Default |
| --------- | --------- | ------- |
| sourceMap | _Boolean_ | `true`  |

## Usage

```
{
  "devDependencies": {
     // here a preset, which uses @zero-scripts/config.webpack
  },
  "zero-scripts": {
    // passing options
    "@zero-scripts/config.webpack": {
      "sourceMap": false
    }
  }
}
```
