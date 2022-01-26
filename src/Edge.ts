import { isRequired } from "./FunctionUtils";
import { MaybeVertex } from "./Graph";
import { VertexId, EdgeId } from "./Identity";
import { uniqueId } from "./Utils/UniqueId";
import { Vertex } from "./Vertex";

export class Edge {
  #uniqueId = uniqueId();
  #id: EdgeId;
  #data: any;
  #vertices: Map<VertexId, Vertex> = new Map([]);

  constructor(edgeId: EdgeId, data?: any) {
    !edgeId && isRequired("edgeId");

    this.#id = edgeId;
    this.#data = data;
  }
  public get id(): EdgeId {
    return this.#id;
  }
  public get data(): any {
    return this.#data;
  }
  public set data(data: any) {
    this.#data = data;
  }
  public get vertices(): Vertex[] {
    return this.#vertices && this.#vertices.size > 0
      ? [...this.#vertices.values()]
      : [];
  }
  public addVertex(vertex: Vertex): boolean {
    this.#vertices.set(vertex.id, vertex);
    return this.#vertices.has(vertex.id);
  }
  public removeVertex(vertex: Vertex): boolean {
    return this.#vertices.delete(vertex.id);
  }
  public getVertex(vertexId: VertexId): MaybeVertex {
    return this.#vertices.get(vertexId);
  }
  public getAdjacentEdgeCount(): number {
    const edges = [...this.#vertices.values()].flatMap((v) => {
      const result = [];
      v.to !== this.#id && result.push(v.to);
      v.from !== this.#id && result.push(v.from);
      return result;
    });
    return new Set(edges).size;
  }
  public getVerticesCount(): number {
    return this.#vertices.size;
  }
  public clearVertices(): void {
    this.#vertices.clear();
  }
  compare(uniqueId: string): boolean {
    return this.#uniqueId === uniqueId;
  }
  uniqueId(): string {
    return this.#uniqueId;
  }
}
