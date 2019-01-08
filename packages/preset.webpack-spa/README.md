# @zero-scripts/preset.webpack-spa

Preset, which aimed for development Single Page Applications

## Scripts

- ### `start`
  Runs the app in development mode

- ### `build`
  Builds the app for production to the `build` folder

## Usage

```
{
  "scripts": {
    "development": "webpack-spa start",
    "production": "webpack-spa build"
  },
  "devDependencies": {
    "@zero-scripts/preset.webpack-spa": "latest"
    // your extensions (optional)
  },
  "zero-scripts": {
    // your options to extensions and configs (optional)
  }
}
```

## Examples

- #### [React](../../examples/react)
