class GraphNode {
  public readonly edges: GraphNode[] = [];

  public constructor(public readonly id: string) {}

  // public walk(walkFn: (node: GraphNode) => any) {
  //   walkFn(this);
  //   this.edges.forEach(edge => {
  //     edge.walk(walkFn);
  //   });
  // }
}

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
}
