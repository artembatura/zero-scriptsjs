# @zero-scripts/extension.webpack-eslint

Lint JavaScript code using ESLint

## Installation

### yarn

```
yarn add -D @zero-scripts/extension.webpack-eslint
```

### npm

```
npm i -D @zero-scripts/extension.webpack-eslint
```

## Options

|       Option        |               Type                | Default |
| :-----------------: | :-------------------------------: | :-----: |
|    **`plugins`**    |            `string[]`             |  `[]`   |
|    **`extends`**    |            `string[]`             |  `[]`   |
|     **`rules`**     | `{ [string]: string[] or any[] }` |  `{}`   |
|      **`env`**      |      `{ [string]: boolean }`      |  `{}`   |
| **`parserOptions`** |        `{ [string]: any }`        |  `{}`   |
|   **`settings`**    |        `{ [string]: any }`        |  `{}`   |

## Passing options

#### `package.json`

```diff
{
  "devDependencies": {
    "@zero-scripts/extension.webpack-eslint": "latest"
  },
+  "zero-scripts": {
+    "extension.webpack-eslint": {
+      "rules": {
+        "no-console": "error",
+        "import-helpers/order-imports": [
+          "warn",
+          {
+            "newlinesBetween": "always",
+            "groups": [
+              "module",
+              ["parent", "sibling", "index"]
+            ],
+            "alphabetize": { "order": "asc", "ignoreCase": true }
+          }
+        ]
+      },
+      "plugins": [
+        "eslint-plugin-import-helpers"
+      ]
+    }
+  }
}
```

## [Main documentation](https://github.com/artemirq/zero-scriptsjs/tree/0.5.x)
