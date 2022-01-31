const Benchmark = require("benchmark");
const { EdgeNG } = require("../lib/cjs/index.js");

const suite = new Benchmark.Suite();

const m1 = new Map();
for (let i = 1; i < 5000; ++i) {
  m1.set(i, { a: i + 1 });
}

suite.add("Checking existens of item in the map", () => {
  for (let i = 1; i < 5000; ++i) {
    let v;
    if (m1.has(i)) {
      v = m1.get(i);
    }
  }
});

const m2 = Object.create(null);
for (let i = 1; i < 5000; ++i) {
  m2[i] = { a: i + 1 };
}

suite.add("Checking existence of items in object(null)", () => {
  for (let i = 1; i < 5000; ++i) {
    let v;
    if (!!m2[i]) {
      v = m2[i];
    }
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
