describe("Object tests", () => {
  it("should not be an instance of object `instanceof`", () => {
    const o = {__proto__: null};
    expect(o instanceof Object).toBeFalsy();
  })
  it("should not be an instance of object `isPrototypeOf`", () => {
    const o = {__proto__: null};
    expect(Object.prototype.isPrototypeOf(o)).toBeFalsy();
  })
  it("should be a type of object `typeof`", () => {
    const o = {__proto__: null};
    expect(typeof o === "object").toBeTruthy();
  })
})