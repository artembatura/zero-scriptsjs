# @zero-scripts/extension.webpack-babel

JavaScript code transpilation using Babel

## Installation

### yarn

```
yarn add -D @zero-scripts/extension.webpack-babel
```

### npm

```
npm i -D @zero-scripts/extension.webpack-babel
```

## Options

|     Option      |                     Type                     | Default |        Description         |
| :-------------: | :------------------------------------------: | :-----: | :------------------------: |
|  **`plugins`**  |                  `string[]`                  |  `[]`   |  Additional Babel plugins  |
|  **`presets`**  |                  `string[]`                  |  `[]`   |  Additional Babel presets  |
|   **`flow`**    |                  `boolean`                   | `false` |    Enable Flow support     |
| **`jsLoaders`** | `Array<{ loader: string; options: object }>` |  `[]`   | Additional Webpack loaders |

**Note:** If you want to enable checking types for your TypeScript files,
you need to install `fork-ts-checker-webpack-plugin`

## Passing options

#### `package.json`

```diff
{
  "devDependencies": {
    // preset...
    "@zero-scripts/extension.webpack-babel": "latest"
  },
+  "zero-scripts": {
+    "extension.webpack-babel": {
+      "presets": ["linaria/babel"],
+      "plugins": ["@babel/plugin-proposal-optional-chaining"],
+      "flow": true
+    }
+  }
}
```

## [Main documentation](https://github.com/artemirq/zero-scriptsjs/tree/0.5.x)
