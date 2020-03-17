import {
  Configuration,
  ConfigurationMeta,
  WorkflowConfigurationType,
  WorkspaceConfigurationType
} from './types';

export function getConfigurationMeta(
  configuration: Configuration
): ConfigurationMeta {
  const workspaceConfig = configuration.workspace,
    workflowConfig = configuration.workflow;

  let workspaceType: WorkspaceConfigurationType =
    WorkspaceConfigurationType.WRONG;

  if (Array.isArray(workspaceConfig)) {
    workspaceType = WorkspaceConfigurationType.ARRAY;
  } else if (typeof workspaceConfig === 'object') {
    workspaceType = WorkspaceConfigurationType.MAPPED_ARRAYS;
  }

  let workflowType: WorkflowConfigurationType = WorkflowConfigurationType.WRONG;

  if (Array.isArray(workflowConfig)) {
    workflowType = WorkflowConfigurationType.ARRAY;
  } else if (typeof workflowConfig === 'object') {
    if ('useWorkspace' in workflowConfig && 'taskFlow' in workflowConfig) {
      workflowType = WorkflowConfigurationType.OBJECT;
    } else {
      workflowType = WorkflowConfigurationType.MAPPED_OBJECTS;
    }
  } else if (workflowConfig === undefined) {
    workflowType = WorkflowConfigurationType.UNSET;
  }

  return {
    isWorkspaceDefined: Boolean(workspaceConfig),
    workspaceType,
    isWorkflowDefined: Boolean(workflowConfig),
    workflowType
  };
}
