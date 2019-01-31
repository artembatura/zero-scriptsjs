export class GraphNode {
  public readonly edges: GraphNode[] = [];

  public constructor(public readonly id: string) {}
}
