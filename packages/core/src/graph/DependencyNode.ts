export class DependencyNode {
  public readonly edges: DependencyNode[] = [];

  public constructor(public readonly id: string) {}

  public addOrGetEdge(id: string): DependencyNode {
    let node = this.edges.find(node => node.id === id);

    if (!node) {
      node = new DependencyNode(id);
      this.edges.push(node);
    }

    return node;
  }

  public toString(): string {
    return this.id;
  }
}
