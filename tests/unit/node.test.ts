import { Edge } from "../../src/Edge";
import { uniqueId } from "../../src/Utils/UniqueId";
import { Vertex } from "../../src/Vertex";

describe("Class Node", () => {
  const instance = new Edge(uniqueId());
  it("should create an instance of the class", () => {
    expect(instance).toBeDefined();
  });
  it("should return `id`", () => {
    expect(instance.id).toBeDefined();
  });
  it("should have a uniqueID", () => {
    console.log("Instance unique Id", instance.uniqueId())
    expect(instance.uniqueId()).toMatch("")
  })
  it("should have getters/setters enumerable", () => {
    const i1 = new Edge(1);
    const i2 = new Edge(2);
    const v1 = new Vertex(Vertex.createVertexId(i1.id, i2.id, 0), i1.id, i2.id);
    const v2 = new Vertex(Vertex.createVertexId(i1.id, i2.id, 1), i1.id, i2.id);
    const v3 = new Vertex(Vertex.createVertexId(i2.id, i1.id, 0), i2.id, i1.id);
    const v4 = new Vertex(Vertex.createVertexId(i2.id, i1.id, 1), i2.id, i1.id);
    i1.addVertex(v1);
    i1.addVertex(v2);
    i2.addVertex(v1);
    i2.addVertex(v2);
    i2.addVertex(v3);
    i1.addVertex(v3);
    i1.addVertex(v4);
    i2.addVertex(v4);
    console.log("Adjancent Edge Count", i1.getAdjacentEdgeCount());
    console.log("Vertices Count",i2.getVerticesCount());
  });
});
