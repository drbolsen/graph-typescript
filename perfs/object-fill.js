const Benchmark = require("benchmark");

const suite = new Benchmark.Suite();

suite.add("Adding items to map", () => {
  const m = new Map();
  for (let i = 1; i < 5000; ++i) {
    m.set(i, { a: i + 1 });
  }
});

suite.add("Adding items to object(null)", () => {
  const m = Object.create(null);
  for (let i = 1; i < 5000; ++i) {
    m[i] = { a: i + 1 };
  }
});

suite.add("Adding items to object(__proto__:null)",() =>{
  const d = {__proto__: null};
  for (let i = 1; i < 5000; ++i) {
    d[i] = { a: i + 1 };
  }  
})

suite
  .on("cycle", (event) => {
    console.log(String(event.target));
  })
  .on("complete", function () {
    console.log("Fastest is " + this.filter("fastest").map("name"));
  })
  // run async
  .run({ async: true });
