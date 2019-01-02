# @zero-scripts/core

## Core conceptions

_Small facts, how `Zero Scripts` works_

### Preset

- First of all it's a set of `scripts` and contains CLI to launch their

- Load `extensions`, which finds in `package.json` (`devDependencies`)

- Script can use (by `getInstance` method) and modify (by external API) `configurations`
   
### Extension

- Not tied to concrete `preset`

- Stores `preset` instance and so can:

   - Add scripts to `preset`

   - Modify `config's`

### Config

- Need to call `build` method for getting JS Object of configuration

- More correctly to call it `Config Builder`. We just simplify name for convenience

- Every Config must need implement own specific external API (to the tool, which configuration build)

## API

Not documented. We do not have stable version and API can change in any time. **Recommend learn API by examples**
