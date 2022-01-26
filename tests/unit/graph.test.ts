import { Graph } from "../../src/Graph";
import { uniqueId } from "../../src/Utils/UniqueId";
import { Vertex } from "../../src/Vertex";

describe("Graph class", () => {
  const instance = new Graph();
  it("should create a new instance of Graph", () => {
    expect(instance).toBeDefined();
  })
  it("should add a new edge to the Graph", () => {
    instance.addEdge(1)
    expect(instance.getEdge(1)?.id).toBeGreaterThanOrEqual(1);
  })
  it("should add another edge to the Graph", () => {
    instance.addEdge(2)
    expect(instance.getEdge(2)?.id).toBeGreaterThanOrEqual(2);
  })
  it("should return a number of edges - 2", () => {
    expect(instance.getEdgesCount()).toBeGreaterThanOrEqual(2);
  })
  it("should creae a vertex between two edges", () => {
    instance.addVertex(1, 2);
    instance.addVertex(1, 1);
    instance.addVertex(1, 2);
    instance.addVertex(2, 1);
    console.log(instance.getEdge(1))
    console.log(instance.getEdge(2))
    console.log(Vertex.parseVertexId("1=>2@0"))
  })
  it("should return list of all multigrpaphs", () => {
    console.log(instance.getVertexSiblings("1=>1@0"));
  })
})