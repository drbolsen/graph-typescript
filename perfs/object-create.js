const Benchmark = require("benchmark");

const suite = new Benchmark.Suite();

suite.add("Crate a map with object and setting prototype to null", () => {
  for (let i = 1; i < 5000; ++i) {
    const d = {__proto__: null};
  }  
})

suite.add("Create a map with Object.create(null)", () => {
  for (let i = 1; i < 5000; ++i) {
    const o = Object.create(null);
  }
});

suite.add("Create a map with Map constructor", () => {
  for (let i = 1; i < 5000; ++i) {
    const m = new Map();
  }
});

suite
  .on("cycle", (event) => {
    console.log(String(event.target));
  })
  .on("complete", function () {
    console.log("Fastest is " + this.filter("fastest").map("name"));
  })
  // run async
  .run({ async: true });
