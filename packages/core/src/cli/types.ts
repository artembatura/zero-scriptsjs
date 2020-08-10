export type Workspace = string[];

export type MappedWorkspace = Record<string, string[]>;

export type Workflow =
  | string[]
  | {
      workspace: string;
      flow: string[];
    };

export type MappedWorkflow = Record<
  string,
  {
    workspace: string;
    flow: string[];
  }
>;

export type Configuration = {
  workspace?: Workspace | MappedWorkspace;
  workflow?: Workflow | MappedWorkflow;
};

export enum WorkflowConfigurationType {
  ARRAY,
  OBJECT,
  MAPPED_OBJECTS,
  UNSET,
  WRONG
}

export enum WorkspaceConfigurationType {
  ARRAY,
  MAPPED_ARRAYS,
  UNSET,
  WRONG
}

export type ConfigurationMeta = {
  isWorkspaceDefined: boolean;
  workspaceType: WorkspaceConfigurationType;
  isWorkflowDefined: boolean;
  workflowType: WorkflowConfigurationType;
};

export type CLIMeta = {
  isWorkflowNamePassed: boolean;
  optionWorkflowName?: string;
  isWorkspaceNamePassed: boolean;
  optionWorkspaceName?: string;
  args: string[];
  atLeastOneArgIsPassed: boolean;
  options: Record<string, boolean | string>;
};
