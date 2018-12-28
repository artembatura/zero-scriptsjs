import { parseScript } from './parseScript';
import { AbstractPreset } from './AbstractPreset';

export const runCLI = async (PresetClass: {
  new (...args: any[]): AbstractPreset;
}) => {
  const preset = new PresetClass();
  const scriptsNames = Array.from(preset.scripts.keys());
  const script = parseScript(process.argv.slice(2), scriptsNames);

  if (script) {
    const scriptHandler = preset.scripts.get(script.name);

    if (scriptHandler) {
      return scriptHandler(script);
    }
  }

  console.log(`[${preset.constructor.name}] Script not found in CLI arguments`);
  console.log(`Available scripts: [${scriptsNames.join(', ')}]`);
};
