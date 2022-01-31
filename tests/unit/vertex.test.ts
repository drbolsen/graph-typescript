import { Edge } from "../../src/Edge";
import { Vertex } from "../../src/Vertex";
import { getNextId } from "../../src/Utils/IdGenerator";

describe("Class Vertex (node)", () => {
  it("should create an instance of Vertex using constructor", () => {
    const i = new Vertex(getNextId(), {});
    expect(i).toBeDefined();
  });
  it("should create multiple instances of Vertex using contstructor", () => {
    const i1 = new Vertex(getNextId(), { id: 1 });
    const i2 = new Vertex(getNextId(), { id: 2 });
    const i3 = new Vertex(getNextId(), { id: 3 });
    expect(i1 && i2 && i3).toBeTruthy();
  });
  it("should has status `isOrphan = true` when created with constructor", () => {
    const i1 = new Vertex(getNextId(), { id: 1 });
    expect(i1.isOrphan).toBeTruthy();
  });
  it("should has status `isLoose = true` when created with constructor", () => {
    const i1 = new Vertex(getNextId(), { id: 1 });
    expect(i1.isLoose).toBeTruthy();
  });
  it("should return vertex `idx` via a getter", () => {
    const nextId = getNextId();
    const i1 = new Vertex(nextId, { id: 1 });
    expect(i1.idx === nextId).toBeTruthy();
  });
  it("should not change vertex idx via `idx`, it should raise an error", () => {
    const nextId = getNextId();
    const i1 = new Vertex(nextId, { id: 1 });
    let error = 0;
    const setter = (i1: Vertex) => {
      try {
        (i1 as any).idx = 10;
      } catch {
        ++error;
      }
      return i1;
    };
    expect(setter(i1).idx === nextId && error === 1).toBeTruthy();
  });
  it("should set data via constructor", () => {
    const i1 = new Vertex(getNextId(), { id: 10 });
    expect(i1.data.id === 10).toBeTruthy();
  });
  it("should return an empty array `getNeiborghs`", () => {
    const i1 = new Vertex(getNextId(), { id: 2 });
    expect(i1.getNeighbours().length === 0).toBeTruthy();
  });
  it("should set data via `setData` method", () => {
    const i = new Vertex(getNextId(), { i: 100 });
    i.setData({ i: 200 });
    expect(i.data.i === 200).toBeTruthy();
  });
});
