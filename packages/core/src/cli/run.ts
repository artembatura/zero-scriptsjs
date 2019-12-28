import mri from 'mri';

import { AbstractPlugin } from '../AbstractPlugin';
import { PluginAPI, WorkspaceBeforeRunAPI } from '../api';
import { readZeroScriptsOptions } from '../utils/readZeroScriptsOptions';
import { Workspace } from '../Workspace';

export function run(argv: string[]): void {
  // read config from package.json
  const config: {
    workspace: string[];
    workflow: string[];
  } = {
    workspace: [],
    workflow: [],
    ...readZeroScriptsOptions()
  };

  const workspace = new Workspace('default');

  const plugins = config.workspace.map(pluginPackageName => {
    const PluginClass = (require(pluginPackageName) as {
      default: { new (): AbstractPlugin };
    }).default;

    const plugin = new PluginClass();

    workspace.plugins.push(plugin);

    return plugin;
  });

  const pluginAPI = new PluginAPI(workspace);

  plugins.forEach(plugin => {
    plugin.apply(pluginAPI);
  });

  const { _: _args, ...options } = mri(argv);
  const [taskName, ...args] = _args;

  workspace.hooks.beforeRun.call(new WorkspaceBeforeRunAPI(workspace));

  const task = workspace.tasks.get(taskName);

  if (!task) {
    return undefined;
  }

  task.run(args, options);
}

// let i = 0;
//
// for (const rule of task.argumentsRules) {
//   const message = rule.getMessage(args[i]);
//
//   if (message) {
//     return console.log(message);
//   }
//
//   i++;
// }

// for (const optionKey of Object.keys(task.optionsRules)) {
//   const rule = task.optionsRules[optionKey];
//   const message = rule.getMessage(options[optionKey]);
//
//   if (message) {
//     return console.log(message);
//   }
// }

// 1) validate package.json config
// 2) apply plugins to workspace
// 3) find task
// 4) validate args and options for task
// 5) run task
