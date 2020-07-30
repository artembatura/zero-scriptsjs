# @zero-scripts/extension.webpack-babel.react

JavaScript code transpilation using Babel with React/JSX support.

## Installation

### yarn

```
yarn add -D @zero-scripts/extension.webpack-babel.react
```

### npm

```
npm i -D @zero-scripts/extension.webpack-babel.react
```

## Options

|     Option      |   Type    | Default |          Description          |
| :-------------: | :-------: | :-----: | :---------------------------: |
| **`propTypes`** | `boolean` | `false` | Strip PropTypes in production |

The rest of options is inherit from [@zero-scripts/extension.webpack-babel](https://github.com/artemirq/zero-scriptsjs/tree/0.5.x/packages/extension.webpack-babel).

## Passing options

#### `package.json`

```diff
{
  "devDependencies": {
    "@zero-scripts/extension.webpack-babel.react": "latest",
  },
+  "zero-scripts": {
+    "extension.webpack-babel.react": {
+      "propTypes": true
+    }
+  }
}
```

## [Main documentation](https://github.com/artemirq/zero-scriptsjs/tree/0.5.x)
