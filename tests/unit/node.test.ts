import { Node } from "../../src/Node";

describe("Class Node", () => {
  const instance = new Node();
  it("should create an instance of the class", () => {
    expect(instance).toBeDefined();
  });
  it("should return `id`", () => {
    expect(instance.id).toBeDefined();
  });
  it("should have getters/setters enumerable", () => {
  });
});
