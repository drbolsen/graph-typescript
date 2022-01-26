import { isRequired } from "./FunctionUtils";
import { VertexId, EdgeId } from "./Identity";
import { uniqueId } from "./Utils/UniqueId";

export class Vertex {
  #uniqueId = uniqueId();
  #id: VertexId;
  #fromEdgeId: EdgeId;
  #toEdgeId: EdgeId;
  #data: any;

  constructor(
    vertexId: VertexId,
    fromEdgeId: EdgeId,
    toEdgeId: EdgeId,
    data?: any
  ) {
    !vertexId && isRequired("vertexId");
    !fromEdgeId && isRequired("fromEdgeId");
    !toEdgeId && isRequired("toEdgeId");

    this.#id = vertexId;
    this.#fromEdgeId = fromEdgeId;
    this.#toEdgeId = toEdgeId;
    this.#data = data;
  }
  public get id(): string {
    return this.#id;
  }
  public get data(): any {
    return this.#data;
  }
  public set data(data: any) {
    this.#data = data;
  }
  public get from(): EdgeId {
    return this.#fromEdgeId;
  }
  public get to(): EdgeId {
    return this.#toEdgeId;
  }
  static createVertexId(
    fromEdgeId: EdgeId,
    toEdgeId: EdgeId,
    idx?: number
  ): VertexId {
    return !(typeof idx === "number")
      ? `${fromEdgeId}=>${toEdgeId}`
      : `${fromEdgeId}=>${toEdgeId}@${idx}`;
  }
  static parseVertexId(vertexId: VertexId): [string, number] {
    const [vertex, id] = vertexId.split("@");
    return [vertex, parseInt(id, 10)];
  }
  compare(uniqueId: string): boolean {
    return this.#uniqueId === uniqueId;
  }
  uniqueId(): string {
    return this.#id;
  }
}
