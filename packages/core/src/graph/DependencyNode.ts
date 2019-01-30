import { GraphNode } from './GraphNode';

export class DependencyNode extends GraphNode {
  public readonly edges: DependencyNode[] = [];

  public resolve(
    resolved: DependencyNode[] = [],
    seen: DependencyNode[] = []
  ): DependencyNode[] {
    seen.push(this);
    this.edges.forEach(edge => {
      if (resolved.indexOf(edge) === -1) {
        if (seen.indexOf(edge) !== -1) {
          throw new Error(
            `Circular reference detected: ${this.id} => ${edge.id}`
          );
        }
        edge.resolve(resolved, seen);
      }
    });
    resolved.push(this);
    return resolved;
  }

  public addOrGetEdge(id: string): DependencyNode {
    let node = this.edges.find(node => node.id === id);

    if (!node) {
      node = new DependencyNode(id);
      this.edges.push(node);
    }

    return node;
  }
}
