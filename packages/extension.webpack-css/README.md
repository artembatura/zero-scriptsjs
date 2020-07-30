# @zero-scripts/extension.webpack-css

Extract, minify and add vendor prefixes for CSS files.

## Installation

### yarn

```
yarn add -D @zero-scripts/extension.webpack-css
```

### npm

```
npm i -D @zero-scripts/extension.webpack-css
```

## Options

|       Option       |                                        Type                                         | Default |
| :----------------: | :---------------------------------------------------------------------------------: | :-----: |
| **`styleLoaders`** | `Array<{ test: string; loader: string; exclude?: string; preprocessor?: string; }>` |  `[]`   |

## Passing options

#### `package.json`

```diff
{
  "devDependencies": {
    "@zero-scripts/extension.webpack-css": "latest"
  },
+  "zero-scripts": {
+    "extension.webpack-css": {
+      "styleLoaders": [
+       {
+         "test": "\\.astro.css",
+         "loader": "astroturf/css-loader"
+       }
+      ]
+    }
+  }
}
```

## [Main documentation](https://github.com/artemirq/zero-scriptsjs/tree/0.5.x)
