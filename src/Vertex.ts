import { Edge } from "./Edge";

type EdgesMap = Record<string, [Edge, string]>;

export interface VertexAPI {
  idx: number;
  data: any;
  edges: Edge[];
  isOrphan: boolean;
  isLoose: boolean;
  addEdge: (edge: Edge, direction: string) => void;
  removeEdge: (edge: Edge) => void;
  hasEdge: (edge: Edge) => boolean;
  getNeighbours: () => number[];
  setData: (d: any) => Vertex;
  toObject: () => Record<string, unknown>;
}

export class Vertex implements VertexAPI {
  [x: string]: any;
  constructor(idx: number, data?: any) {
    this._idx = idx;
    this._kind = 0;
    this._edges = Object.create(null) as EdgesMap;
    this._data = data;
  }
  get idx(): number {
    return this._idx;
  }
  get data(): any {
    return this._data;
  }
  set data(d: any) {
    this._data = d;
  }
  get edges(): Edge[] {
    return Object.values(this._edges as EdgesMap).map((v) => {
      const [edge] = v;
      return edge;
    });
  }
  get isOrphan(): boolean {
    return Object.values(this._edges as EdgesMap).every((v) => {
      const [, direction] = v;
      return direction !== "source";
    });
  }
  get isLoose(): boolean {
    return Object.values(this._edges as EdgesMap).every((v) => {
      const [, direction] = v;
      return direction !== "target";
    });
  }
  public addEdge(edge: Edge, direction: string) {
    this._edges[edge.idx] = [edge, direction];
  }
  public removeEdge(edge: Edge) {
    delete this._edges[edge.idx];
  }
  public cleanEdges(): void {
    this._edges = Object.create(null) as EdgesMap;
  }
  public hasEdge(edge: Edge): boolean {
    return !!this._edges[edge.idx];
  }
  public getNeighbours(): number[] {
    return Object.values(this._edges as EdgesMap).reduce((acc, v) => {
      const [edge, direction] = v;
      if (direction === "source") {
        acc.push(edge.target.idx);
      }
      return acc;
    }, [] as number[]);
  }
  public setData(d: any): Vertex {
    if (d) {
      this._data = d;
    }
    return this;
  }
  public toObject(): Record<string, unknown> {
    return {
      _idx: this._idx,
    };
  }
}
