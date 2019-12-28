import { DependencyNode } from './DependencyNode';
import { traverseRecursive } from './traverseRecursive';

export function findRecursive(
  rootNode: DependencyNode,
  id: string
): DependencyNode | undefined {
  let resultNode: DependencyNode | undefined = undefined;

  traverseRecursive(rootNode, node => {
    if (node.id === id) {
      resultNode = node;

      return true;
    }

    return false;
  });

  return resultNode;
}
