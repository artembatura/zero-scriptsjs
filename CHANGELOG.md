## 0.4.0 (2019-02-03)

#### :rocket: New Feature
* `config.webpack`, `extension.webpack-css`, `extension.webpack-sass`
  * [#105](https://github.com/zero-scripts/zero-scripts/pull/105) extension.webpack-{css,sass}: Add styles minification ([@artemirq](https://github.com/artemirq))
* `config.webpack`, `extension.webpack-pwa`
  * [#104](https://github.com/zero-scripts/zero-scripts/pull/104) extension.webpack-pwa: Create extension, which adds PWA capabilities ([@artemirq](https://github.com/artemirq))

#### :bug: Bug Fix
* `core`
  * [#102](https://github.com/zero-scripts/zero-scripts/pull/102) core: Improvement, Bugfix. Change algorithm of modification configuration ([@artemirq](https://github.com/artemirq))

#### :nail_care: Enhancement
* `core`
  * [#102](https://github.com/zero-scripts/zero-scripts/pull/102) core: Improvement, Bugfix. Change algorithm of modification configuration ([@artemirq](https://github.com/artemirq))

#### :new: New Package
* `config.webpack`, `extension.webpack-pwa`
  * [#104](https://github.com/zero-scripts/zero-scripts/pull/104) extension.webpack-pwa: Create extension, which adds PWA capabilities ([@artemirq](https://github.com/artemirq))

#### Committers: 1
- Artem Batura ([@artemirq](https://github.com/artemirq))

## 0.3.0 (2019-01-31)

#### :boom: Breaking Change
* `config.webpack`, `core`, `extension.webpack-babel.react`, `extension.webpack-babel`, `extension.webpack-css`, `extension.webpack-eslint`, `extension.webpack-sass`, `preset.webpack-spa`, `utils.webpack-styles`
  * [#91](https://github.com/zero-scripts/zero-scripts/pull/91) evolution(core): big refactoring, improvements and cleanups ([@artemirq](https://github.com/artemirq))

#### :rocket: New Feature
* `config.webpack`, `extension.webpack-babel.react`, `extension.webpack-babel`
  * [#56](https://github.com/zero-scripts/zero-scripts/pull/56) feature(extension.webpack-babel): TypeScript support using Babel 7 (optionally) ([@artemirq](https://github.com/artemirq))

#### :bug: Bug Fix
* `extension.webpack-css`, `extension.webpack-sass`
  * [#62](https://github.com/zero-scripts/zero-scripts/pull/62) fix(): prevent repeating modifications ([@artemirq](https://github.com/artemirq))

#### :nail_care: Enhancement
* `config.webpack`, `core`, `extension.webpack-babel.react`, `extension.webpack-babel`, `extension.webpack-css`, `extension.webpack-eslint`, `extension.webpack-sass`, `preset.webpack-spa`
  * [#69](https://github.com/zero-scripts/zero-scripts/pull/69) improvement(): improve configurations ([@artemirq](https://github.com/artemirq))
* `config.webpack`, `core`, `extension.webpack-babel`, `extension.webpack-css`, `extension.webpack-eslint`, `extension.webpack-sass`
  * [#70](https://github.com/zero-scripts/zero-scripts/pull/70) improvement(config.webpack): move all loaders to `oneOf` ([@artemirq](https://github.com/artemirq))
* `core`, `preset.webpack-spa`
  * [#66](https://github.com/zero-scripts/zero-scripts/pull/66) improvement(preset.webpack-spa): improve console logging ([@artemirq](https://github.com/artemirq))
* `extension.webpack-babel`
  * [#63](https://github.com/zero-scripts/zero-scripts/pull/63) feature(extension.webpack-babel): add option for adding plugins ([@artemirq](https://github.com/artemirq))
* `config.webpack`, `core`
  * [#61](https://github.com/zero-scripts/zero-scripts/pull/61) feature(core): implement identification for modifications ([@artemirq](https://github.com/artemirq))
* `extension.webpack-css`, `utils.webpack-styles`
  * [#57](https://github.com/zero-scripts/zero-scripts/pull/57) improvement(extension.webpack-css): move utilities to a separated package ([@artemirq](https://github.com/artemirq))
* `config.webpack`, `extension.webpack-babel`, `extension.webpack-eslint`, `preset.webpack-spa`
  * [#55](https://github.com/zero-scripts/zero-scripts/pull/55) improvement(config.webpack): make fully customizable options  ([@artemirq](https://github.com/artemirq))

#### :memo: Documentation
* `config.webpack`, `core`, `extension.webpack-babel.react`, `extension.webpack-sass`
  * [#77](https://github.com/zero-scripts/zero-scripts/pull/77) docs(): update readme ([@artemirq](https://github.com/artemirq))
* `config.webpack`, `core`, `extension.webpack-babel.react`, `extension.webpack-babel`, `extension.webpack-css`, `extension.webpack-eslint`, `preset.webpack-spa`
  * [#47](https://github.com/zero-scripts/zero-scripts/pull/47) docs(readme): improve readme ([@artemirq](https://github.com/artemirq))

#### :house: Internal
* `config.webpack`, `core`, `extension.webpack-babel.react`, `extension.webpack-babel`, `extension.webpack-css`, `extension.webpack-eslint`, `extension.webpack-sass`, `preset.webpack-spa`, `utils.webpack-styles`
  * [#91](https://github.com/zero-scripts/zero-scripts/pull/91) evolution(core): big refactoring, improvements and cleanups ([@artemirq](https://github.com/artemirq))

#### :new: New Package
* `extension.webpack-babel`, `extension.webpack-eslint.react`, `extension.webpack-eslint`
  * [#93](https://github.com/zero-scripts/zero-scripts/pull/93) feature(extension.webpack-eslint.react): create new extension, add new … ([@artemirq](https://github.com/artemirq))
* `extension.webpack-sass`, `utils.webpack-styles`
  * [#59](https://github.com/zero-scripts/zero-scripts/pull/59) feature(extension.webpack-sass): create extension for support Sass an… ([@artemirq](https://github.com/artemirq))

#### Committers: 1
- Artem Batura ([@artemirq](https://github.com/artemirq))

## 0.2.0 (2019-01-08)

#### :boom: Breaking Change
* `extension.webpack-babel`
  * [#31](https://github.com/artemirq/zero-scripts/pull/31) feature(extension.webpack-babel): add option `presets` and remove react support ([@artemirq](https://github.com/artemirq))
* `core`, `extension.webpack-babel`
  * [#25](https://github.com/artemirq/zero-scripts/pull/25) feature(): read any options from `react-scripts` key in `package.json` ([@artemirq](https://github.com/artemirq))

#### :rocket: New Feature
* `extension.webpack-babel.react`
  * [#32](https://github.com/artemirq/zero-scripts/pull/32) feature(extension.webpack-babel.react): create package ([@artemirq](https://github.com/artemirq))
* `extension.webpack-babel`
  * [#31](https://github.com/artemirq/zero-scripts/pull/31) feature(extension.webpack-babel): add option `presets` and remove react support ([@artemirq](https://github.com/artemirq))
* `core`
  * [#29](https://github.com/artemirq/zero-scripts/pull/29) feature(core): add logic to handle substitutability of extensions ([@artemirq](https://github.com/artemirq))

#### :nail_care: Enhancement
* `config.webpack`, `core`, `ts-config`
  * [#36](https://github.com/artemirq/zero-scripts/pull/36) improvement(core): move options reading logic to read-options decorator ([@artemirq](https://github.com/artemirq))
* `extension.webpack-eslint`
  * [#11](https://github.com/artemirq/zero-scripts/pull/11) feature(extension.webpack-eslint): small improve eslint config ([@artemirq](https://github.com/artemirq))
* `preset.webpack-spa`
  * [#33](https://github.com/artemirq/zero-scripts/pull/33) improvement(preset.webpack-spa): handle unhandled rejections ([@artemirq](https://github.com/artemirq))
* `core`
  * [#30](https://github.com/artemirq/zero-scripts/pull/30) improvement(core): abstract-extension use partial options ([@artemirq](https://github.com/artemirq))
* `core`, `extension.webpack-babel`
  * [#25](https://github.com/artemirq/zero-scripts/pull/25) feature(): read any options from `react-scripts` key in `package.json` ([@artemirq](https://github.com/artemirq))

#### :memo: Documentation
* `config.webpack`, `core`, `extension.webpack-babel.react`, `extension.webpack-babel`, `extension.webpack-css`, `extension.webpack-eslint`, `preset.webpack-spa`
  * [#38](https://github.com/artemirq/zero-scripts/pull/38)  docs(): great improve to readme, fix mistakes ([@artemirq](https://github.com/artemirq))
* `core`
  * [#19](https://github.com/artemirq/zero-scripts/pull/19) docs(): improve readme ([@artemirq](https://github.com/artemirq))
* `config.webpack`, `core`, `extension.webpack-babel`, `extension.webpack-css`, `extension.webpack-eslint`, `preset.webpack-spa`
  * [#18](https://github.com/artemirq/zero-scripts/pull/18) docs(): write readme for all packages ([@artemirq](https://github.com/artemirq))

#### Committers: 1
- Artem Batura ([@artemirq](https://github.com/artemirq))
