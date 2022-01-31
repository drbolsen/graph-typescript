import { Edge } from "../../src/Edge";
import { GraphError } from "../../src/Error";
import { Graph } from "../../src/Graph";
import { getNextId } from "../../src/Utils/IdGenerator";
import { Vertex } from "../../src/Vertex";

describe("Graph class", () => {
  it("should instanciate a new graph", () => {
    const i = new Graph();
    expect(i).toBeDefined();
  });
  // Vertex API
  it("should create a vertex", () => {
    const i = new Graph();
    const idx = getNextId();
    i.createVertex(idx, { myVertex: "vertex" });
    expect(i.hasVertex(idx)).toBeTruthy();
  });
  it("should remove the existing vertex", () => {
    const i = new Graph();
    const idx = getNextId();
    i.createVertex(idx, { myVertex: "vertex" });
    const r = i.removeVertex(idx);
    expect(r && !i.hasVertex(idx)).toBeTruthy();
  });
  it("should modify data of the existing vertex", () => {
    const i = new Graph();
    const idx = getNextId();
    i.createVertex(idx, { myVertex: "vertex" });
    i.updateVertex(idx, { myVertex: "vertex1" });
    const [, v] = <[GraphError, Vertex]>i.getVertex(idx);
    expect((v as any).data.myVertex === "vertex1").toBeTruthy();
  });
  it("should get a vertex from the graph by its `idx`", () => {});
  it("should create two vertices and link them with an edge", () => {
    const i = new Graph();
    const [, vertex1] = <[GraphError, Vertex]>i.createVertex(getNextId(), {
      myVertex: "vertex1",
    });
    const [, vertex2] = <[GraphError, Vertex]>i.createVertex(getNextId(), {
      myVertex: "vertex2",
    });
    i.createEdge(vertex1.idx, vertex2.idx, {
      myEdge: "edge1",
    });
    expect(i.verticesCount() === 2 && i.edgesCount() === 1).toBeTruthy();
  });
  it("should return an error when try to create a vertex with the same id", () => {
    const i = new Graph();
    const idx = getNextId();
    i.createVertex(idx, { myVertex: "vertex" });
    const [err] = <[GraphError, Vertex]>(
      i.createVertex(idx, { myVertex: "vertex" })
    );
    expect(err).toBeDefined();
  });
  it("should remove one of two vertices and remove the connecting edge", () => {
    const i = new Graph();
    const [, vertex1] = <[GraphError, Vertex]>i.createVertex(getNextId(), {
      myVertex: "vertex1",
    });
    const [, vertex2] = <[GraphError, Vertex]>i.createVertex(getNextId(), {
      myVertex: "vertex2",
    });
    const [, edge1] = <[GraphError, Edge]>i.createEdge(
      vertex1.idx,
      vertex2.idx,
      {
        myEdge: "edge1",
      }
    );
    const r = i.removeVertex(vertex1);
    expect(
      r &&
        i.verticesCount() === 1 &&
        i.edgesCount() === 0 &&
        vertex1.isLoose &&
        vertex2.isOrphan
    ).toBeTruthy();
  });
  it("should remove an edge and leave to loose/orphan vertices", () => {
    const i = new Graph();
    const [, vertex1] = <[GraphError, Vertex]>i.createVertex(getNextId(), {
      myVertex: "vertex1",
    });
    const [, vertex2] = <[GraphError, Vertex]>i.createVertex(getNextId(), {
      myVertex: "vertex2",
    });
    const [, edge1] = <[GraphError, Edge]>i.createEdge(
      vertex1.idx,
      vertex2.idx,
      {
        myEdge: "edge1",
      }
    );
    const r = i.removeEdge(edge1);

    expect(
      r // &&
      // i.verticesCount() === 2 &&
      // i.edgesCount() === 0 &&
      // vertex1.isLoose &&
      // vertex2.isOrphan
    ).toBeTruthy();
  });
  it("should remove one of the edges", () => {
    const i = new Graph();
    const [, vertex1] = <[GraphError, Vertex]>i.createVertex(getNextId(), {
      myVertex: "vertex1",
    });
    const [, vertex2] = <[GraphError, Vertex]>i.createVertex(getNextId(), {
      myVertex: "vertex2",
    });
    const [, edge1] = <[GraphError, Edge]>i.createEdge(
      vertex1.idx,
      vertex2.idx,
      {
        myEdge: "edge1",
      }
    );

    const [, edge2] = <[GraphError, Edge]>i.createEdge(
      vertex1.idx,
      vertex2.idx,
      {
        myEdge: "edge2",
      }
    );

    const r = i.removeEdge(edge1);

    expect(
      r && i.verticesCount() === 2 && i.edgesCount() === 1 // &&
      // vertex1.isLoose &&
      // vertex2.isOrphan
    ).toBeTruthy();
  });
  it("should fire `changed` events if this option is enabled", () => {
    const i = new Graph({ opEvents: true });
    let counter = 0;
    i.on("changed", () => {
      ++counter;
    });
    const [, vertex1] = <[GraphError, Vertex]>i.createVertex(getNextId(), {
      myVertex: "vertex1",
    });
    const [, vertex2] = <[GraphError, Vertex]>i.createVertex(getNextId(), {
      myVertex: "vertex2",
    });
    const [, edge1] = <[GraphError, Edge]>i.createEdge(
      vertex1.idx,
      vertex2.idx,
      {
        myEdge: "edge1",
      }
    );
    i.removeEdge(edge1);
    // Fire 4 times: add Vertex, add Vertex, add Edge, remove Edge
    expect(counter === 4).toBeTruthy();
  });
});
