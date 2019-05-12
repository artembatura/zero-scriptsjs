import { DependencyNode } from './DependencyNode';

export function resolve(
  rootNode: DependencyNode,
  resolved: DependencyNode[] = [],
  unresolved: DependencyNode[] = []
): DependencyNode[] {
  unresolved.push(rootNode);
  rootNode.edges.forEach(edgeNode => {
    if (resolved.findIndex(node => node.id === edgeNode.id) === -1) {
      if (unresolved.findIndex(node => node.id === edgeNode.id) !== -1) {
        throw new Error(
          `Circular reference detected: ${rootNode.id} => ${edgeNode.id}`
        );
      }

      resolve(edgeNode, resolved, unresolved);
    }
  });
  resolved.push(rootNode);
  unresolved.splice(unresolved.indexOf(rootNode));
  return resolved;
}
