import mri from 'mri';

import { CLIMeta } from './types';

export function getCLIMeta(argv: string[]): CLIMeta {
  const { _: args, ...options } = mri(argv);

  const { workflow, wf, workspace, ws, ...restOptions } = options;

  const workflowName: string | undefined = workflow || wf;
  const workspaceName: string | undefined = workspace || ws;

  return {
    isWorkflowNamePassed: Boolean(workflowName),
    optionWorkflowName: workflowName,
    isWorkspaceNamePassed: Boolean(workspaceName),
    optionWorkspaceName: workspaceName,
    args: args as string[],
    options: restOptions,
    atLeastOneArgIsPassed: Boolean(args) && args.length > 0
  };
}
