import { Events } from "./Events";
import { VertexId, EdgeId } from "./Identity";
import { Vertex } from "./Vertex";
import { Edge } from "./Edge";
import { uniqueId } from "./Utils/UniqueId";

export type MaybeEdge = Edge | undefined;
export type MaybeVertex = Vertex | undefined;

export class Graph extends Events {
  private _edges: Map<EdgeId, Edge> = new Map();
  private _vertices: Map<VertexId, Vertex> = new Map();
  private _multiEdge: Map<VertexId, Set<number>> = new Map();
  private _suspendEvents = 0;
  private _multiGraph: boolean;

  constructor(options: any = {}) {
    super();
    const { multiGraph = false } = options;

    this._multiGraph = multiGraph;
  }
  private disableChanges() {
    this._suspendEvents += 1;
  }
  private enableChanges() {
    this._suspendEvents -= 1;
  }

  public hasEdge(edgeId?: EdgeId): boolean {
    return !edgeId ? false : this._edges.has(edgeId);
  }
  public getEdge(edgeId: EdgeId): MaybeEdge {
    return this._edges.get(edgeId);
  }
  public getEdgesCount(): number {
    return this._edges.size;
  }
  public getEdgeVertices(edgeId: EdgeId): Vertex[] {
    return this.hasEdge(edgeId) ? (this.getEdge(edgeId) as Edge).vertices : [];
  }

  public hasVertex(vertexId?: string): boolean {
    return !vertexId ? false : this._vertices.has(vertexId);
  }
  public getVertexById(vertexId: string): MaybeVertex {
    return this._vertices.get(vertexId);
  }
  public getVertex(fromEdgeId: EdgeId, toEdgeId: EdgeId): MaybeVertex {
    const vertexId = Graph.createVertexId(fromEdgeId, toEdgeId);
    const multiEdge = this._multiEdge.get(vertexId);
    const hasSiblings = !!multiEdge && multiEdge.size > 1;
    return undefined;
  }
  public getVerticesCount(): number {
    return this._vertices.size;
  }
  public getVertexNodes(vertexId: VertexId): [EdgeId?, EdgeId?] {
    if (!this._vertices.has(vertexId)) {
      return [];
    }
    const { from, to } = this._vertices.get(vertexId) as Vertex;
    return [from, to];
  }
  public getVertexSiblings(vertexId: VertexId): any[] {
    const [vertex] = Vertex.parseVertexId(vertexId);
    const v = this._multiEdge.get(vertex)?.values() || []
    return Array.from(v).map(idx => `${vertex}@${idx}`)
  }

  public addEdge(edgeId?: EdgeId, data?: any): Edge {
    this.disableChanges();
    const isNodeExist: boolean = this.hasEdge(edgeId);

    const node = isNodeExist
      ? (this.getEdge(edgeId as string) as Edge)
      : new Edge(edgeId || uniqueId());

    node.data = data;
    this._edges.set(node.id, node);

    this.recordNodeEvent(node, isNodeExist ? "update" : "add");

    this.enableChanges();

    return node;
  }
  public addVertex(fromEdgeId: EdgeId, toEdgeId: EdgeId, data?: any): Vertex {
    this.enableChanges();

    const fromNode = this.hasEdge(fromEdgeId)
      ? (this.getEdge(fromEdgeId) as Edge)
      : this.addEdge(fromEdgeId);
    const toNode = this.hasEdge(toEdgeId)
      ? (this.getEdge(toEdgeId) as Edge)
      : this.addEdge(toEdgeId);

    const multiEdgeLinkIdx = Graph.createVertexId(fromNode.id, toNode.id);
    // No previous multi edge exists
    if (!this._multiEdge.has(multiEdgeLinkIdx)) {
      this._multiEdge.set(multiEdgeLinkIdx, new Set([]));
    }

    const idx = this._multiEdge.get(multiEdgeLinkIdx)?.size as number;
    this._multiEdge.get(multiEdgeLinkIdx)?.add(idx);
    const linkId = Graph.createVertexId(fromNode.id, toNode.id, idx);

    const isExist = this._vertices.has(linkId);
    const link = isExist
      ? (this._vertices.get(linkId) as Vertex)
      : new Vertex(linkId, fromNode.id, toNode.id, data);

    link.data = data;

    this._vertices.set(linkId, link);
    fromNode.addVertex(link);
    if (fromNode.id !== toNode.id) {
      toNode.addVertex(link);
    }
    this.recordLinkEvent(link, isExist ? "update" : "add");

    this.disableChanges();
    return link;
  }
  public removeEdge(edgeId?: EdgeId): boolean {
    if (!edgeId || !this.hasEdge(edgeId)) return false;
    this.enableChanges();

    const edge = this.getEdge(edgeId) as Edge;

    edge.vertices.forEach((link) => {
      this.removeVertex(link)
    });

    edge.clearVertices();

    this.disableChanges();
    return true;
  }

  public removeVertex(a: Vertex): void
  public removeVertex(a: EdgeId, b?: EdgeId): void
  public removeVertex(a: any, b?: any): void {
    const vertexId = a instanceof Vertex ? a.id : Graph.createVertexId(a, b);
    const vertex = this.getVertex(a, b)
  };

  private removeLinkInstance(): void {}

  getLinks(): void {}
  forEachNode(): void {}
  forEachLinkedNode(): void {}
  forEachLink(): void {}
  startUpdate(): void {}
  finshUpdate(): void {}
  clear(): void {}
  private recordNodeEvent(node: Edge, eventName: string) {}
  private recordLinkEvent(link: Vertex, eventName: string) {}

  private static createVertexId(
    fromNodeId: EdgeId,
    toNodeId: EdgeId,
    idx?: number
  ): string {
    return !(typeof idx == "number")
      ? `${fromNodeId}=>${toNodeId}`
      : `${fromNodeId}=>${toNodeId}@${idx}`;
  }
}
