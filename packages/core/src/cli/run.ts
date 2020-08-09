import mri from 'mri';
import { Optional } from 'utility-types';

import { AbstractPlugin } from '../AbstractPlugin';
import { PluginAPI, WorkspaceBeforeRunAPI } from '../api';
import { readPackageJson } from '../utils/readPackageJson';
import { readZeroScriptsOptions } from '../utils/readZeroScriptsOptions';
import { WorkSpace } from '../WorkSpace';
import { getCLIMeta } from './getCLIMeta';
import { getConfigurationMeta } from './getConfigurationMeta';
import {
  CLIMeta,
  Configuration,
  ConfigurationMeta,
  MappedWorkflow,
  MappedWorkspace,
  Workflow,
  WorkflowConfigurationType,
  Workspace,
  WorkspaceConfigurationType
} from './types';

function getPluginPackageList(
  configuration: Configuration,
  meta: ConfigurationMeta,
  workSpaceName: string | undefined
): string[] | undefined {
  if (meta.workspaceType === WorkspaceConfigurationType.ARRAY) {
    return configuration.workspace as Workspace;
  }

  if (meta.workspaceType === WorkspaceConfigurationType.UNSET) {
    const devDependencies = readPackageJson(pkg =>
      Object.keys(pkg?.devDependencies || {})
    );

    console.log(
      'Workspace option is not set, loading official plugins from devDependencies...'
    );
    console.log(devDependencies);

    return devDependencies.filter(pkgName =>
      /^@?[a-z-]*\/?plugin-[a-z-]*$/.test(pkgName)
    );
  }

  if (meta.workspaceType === WorkspaceConfigurationType.MAPPED_ARRAYS) {
    return (configuration.workspace as Optional<MappedWorkspace>)[
      workSpaceName || 'default'
    ];
  }

  throw new Error(
    `Error: Unsupported [configuration.workspace] type "${typeof configuration.workspace}".`
  );
}

export async function run(argv: string[]): Promise<void> {
  const cliMeta: CLIMeta = getCLIMeta(argv);

  const configuration: Configuration = readZeroScriptsOptions();
  const configMeta: ConfigurationMeta = getConfigurationMeta(configuration);

  if (configMeta.workflowType === WorkflowConfigurationType.WRONG) {
    throw new Error(
      `Error: Unsupported [configuration.workflow] type "${typeof configuration.workflow}".`
    );
  }

  if (
    configMeta.isWorkflowDefined &&
    cliMeta.isWorkflowNamePassed &&
    (configMeta.workflowType === WorkflowConfigurationType.ARRAY ||
      configMeta.workflowType == WorkflowConfigurationType.OBJECT)
  ) {
    console.log(
      `Warning: Option "--workflow ${cliMeta.optionWorkflowName}" is ignored, because [configuration.workflow] is Array.`
    );
  }

  const workFlow =
    configMeta.isWorkflowDefined &&
    configMeta.workflowType === WorkflowConfigurationType.MAPPED_OBJECTS
      ? ((configuration as Required<Configuration>).workflow as MappedWorkflow)[
          cliMeta.optionWorkflowName || 'default'
        ]
      : (configuration.workflow as Workflow | undefined);

  const workSpaceName: string | undefined =
    workFlow && 'workspace' in workFlow
      ? workFlow.workspace
      : cliMeta.optionWorkspaceName;

  if (cliMeta.isWorkspaceNamePassed && cliMeta.isWorkflowNamePassed) {
    throw new Error(
      `Error: Can't use "--workflow ${cliMeta.optionWorkflowName}" and "--workspace ${cliMeta.optionWorkspaceName}" options together.`
    );
  }

  if (
    configMeta.workspaceType === WorkspaceConfigurationType.ARRAY &&
    cliMeta.isWorkspaceNamePassed
  ) {
    console.log(
      `Warning: Passed option "--workspace ${workSpaceName}" is ignored, because [configuration.workspace] is already array.`
    );
  }

  const pluginPackageNames = getPluginPackageList(
    configuration,
    configMeta,
    workSpaceName
  );

  if (!pluginPackageNames) {
    if (workSpaceName) {
      const availableOptions = Object.keys(configuration.workspace || {});
      const availableOptionsString =
        availableOptions.length > 0
          ? `Available options: [${availableOptions.join(', ')}].`
          : 'No available options is defined.';

      throw new Error(
        `Error: Workspace with key "${workSpaceName}" is not exists in your workspace object. ${availableOptionsString}`
      );
    } else {
      throw new Error(
        'Error: You should provide --workspace option with name of workspace, which should be loaded.'
      );
    }
  }

  const workSpaceInstance = new WorkSpace('default');

  const plugins = pluginPackageNames.map(pluginPackageName => {
    const PluginClass = (require(pluginPackageName) as {
      default: { new (): AbstractPlugin };
    }).default;

    const plugin = new PluginClass();

    workSpaceInstance.plugins.push(plugin);

    return plugin;
  });

  const pluginAPI = new PluginAPI(workSpaceInstance);

  plugins.forEach(plugin => {
    plugin.apply(pluginAPI);
  });

  workSpaceInstance.hooks.beforeRun.call(
    new WorkspaceBeforeRunAPI(workSpaceInstance)
  );

  const taskQueue = workFlow
    ? Array.isArray(workFlow)
      ? workFlow
      : workFlow.flow
    : cliMeta.args;

  for (const taskString of taskQueue) {
    const taskArgv = taskString.split(' ');

    const { _: args, ...options } = mri(taskArgv);
    const [taskName, ...restArgs] = args;

    const task = workSpaceInstance.tasks.get(taskName);

    // TODO: check this before running queue
    if (!task) {
      throw new Error(
        `Error: Task "${taskName}" is not exists in your workspace "${workSpaceName}".`
      );
    }

    const useCommonArgsAndOptions =
      Object.keys(options).length === 0 && restArgs.length === 0;

    const finalArgs = useCommonArgsAndOptions ? cliMeta.args : restArgs;
    const finalOptions = useCommonArgsAndOptions ? cliMeta.options : options;

    await task.run(finalArgs, finalOptions);
  }
}
