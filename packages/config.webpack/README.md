# @zero-scripts/config.webpack

**Note**: You don't need to install this package manually. This package exists to be used inside extensions or presets.

## Options

|           Option           |   Type    |                    Default                     |
| :------------------------: | :-------: | :--------------------------------------------: |
|     **`useSourceMap`**     | `boolean` |                     `true`                     |
|    **`useTypescript`**     | `boolean` | `true` if `tsconfig.json` exists, else `false` |
|   **`additionalEntry`**    |  `array`  |                      `[]`                      |
| **`moduleFileExtensions`** |  `array`  |                      `[]`                      |
|   **`jsFileExtensions`**   |  `array`  |                      `[]`                      |
|        **`paths`**         | `object`  |                                                |
|      **`paths.root`**      | `string`  |                                                |
|      **`paths.src`**       | `string`  |                     `src`                      |
|     **`paths.build`**      | `string`  |                    `build`                     |
|    **`paths.indexJs`**     | `string`  |                  `src/index`                   |
|   **`paths.indexHtml`**    | `string`  |              `public/index.html`               |
|     **`paths.public`**     | `string`  |                    `public`                    |

## Passing options

#### Turn off source maps

#### `package.json`

```diff
{
   ...
+  "zero-scripts": {
+    "config.webpack": {
+      "sourceMap": false
+    }
+  }
}
```

#### Handle source files which placed in the root directory

#### `package.json`

```diff
{
  ...
+  "zero-scripts": {
+    "config.webpack": {
+      "paths": {
+         "src": "",
+         "indexJs": "index"
+      }
+    }
+  }
}
```

## [Main documentation](https://github.com/artemirq/zero-scriptsjs/tree/0.5.x)
