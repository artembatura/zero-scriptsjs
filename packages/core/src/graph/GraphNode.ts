export class GraphNode {
  public readonly edges: GraphNode[] = [];

  public constructor(public readonly id: string) {}

  // public walk(walkFn: (node: GraphNode) => any) {
  //   walkFn(this);
  //   this.edges.forEach(edge => {
  //     edge.walk(walkFn);
  //   });
  // }
}
