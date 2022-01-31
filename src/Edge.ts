import { Vertex } from "./Vertex";

export interface EdgeAPI {
  idx: string;
  source: Vertex;
  target: Vertex;
  vertices: [number, number];
  isDangling: boolean;
  rootIdx: string;
  setData: (d: any) => Edge;
}

export class Edge implements EdgeAPI {
  [x: string]: any;
  constructor(source: Vertex, target: Vertex, data?: any) {
    this._idx = `${source.idx}=>${target.idx}`;
    this._kind = 1;
    this._source = source;
    this._target = target;
    this._data = data;
  }
  public get idx(): string {
    return this._idx;
  }
  public set idx(s: string) {
    this._idx = s;
  }
  public get kind(): number {
    return this._kind;
  }
  public get source(): Vertex {
    return this._source;
  }
  public set source(s: Vertex) {
    this._source = s;
  }
  public get target(): Vertex {
    return this._target;
  }
  public set target(t: Vertex) {
    this._target = t;
  }
  public get vertices(): [number, number] {
    return [(this._source as Vertex).idx, (this._target as Vertex).idx];
  }
  public get isDangling(): boolean {
    return !this._source || !this._target;
  }
  public get rootIdx(): string {
    return this.isDangling ? "" : `${this._source.idx}=>${this._target.idx}`;
  }
  public setData(data?: any): Edge {
    if (data) {
      this.data = data;
    }
    return this;
  }
  public toObject(): Record<string, unknown> {
    return {
      _idx: this._idx,
    };
  }
  public static genIdx(sourceIdx: number, targetIdx: number) {
    return `${sourceIdx}=>${targetIdx}`;
  }
}
