import { DependencyNode } from './DependencyNode';

export function traverseRecursive(
  rootNode: DependencyNode,
  fnCallback: (node: DependencyNode) => boolean
): void {
  fnCallback(rootNode);

  for (const edge of rootNode.edges) {
    if (fnCallback(edge)) {
      break;
    }
  }

  return undefined;
}
