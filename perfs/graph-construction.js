const { Graph, Vertex, Edge } = require("../lib/cjs/index.js");
const Benchmark = require("benchmark");

const suite = new Benchmark.Suite();
// Mock up a graph with 5000 disconneted vertices
const graph = new Graph();
for (let k = 0; k < 5001; ++k) {
  v = new Vertex(k);
  graph.addVertex(v);
}

let counter = 0;
let stopper = 0;
let cycles = 0;
let runPerCycle = [];

suite.add(
  "Creating 5,000 edges",
  () => {
    if (stopper < 1) {
      for (let i = 0; i < 5000; ++i) {
        const [err, e] = graph.createEdge(i, i + 1);
      }
      ++cycles;
    }
    ++stopper;
  },
  {
    onCycle: () => {
      graph.cleanEdges();
      stopper = 0;
      ++counter;
    },
  }
);

suite.add(
  "Alternative test",
  () => {
    const graph1 = new Graph();
    for (let k = 0; k < 5001; ++k) {
      graph1.createVertex(k);
    }
    for (let i = 0; i < 5000; ++i) {
      graph1.createEdge(i, i + 1);
    }
  },
  {
    onCycle: () => {},
  }
);

suite.add("Alternative test with addEdge", () => {
  const graph1 = new Graph();
  for (let k = 0; k < 5001; ++k) {
    graph1.createVertex(k);
  }
  for (let i = 0; i < 5000; ++i) {
    const [, v1] = graph1.getVertex(i);
    const [, v2] = graph1.getVertex(i + 1);
    const e = new Edge(v1, v2);
    v1.addEdge(e);
    v2.addEdge(e);
    graph1.addEdge(e);
  }
});

suite.add(
  "Alternative test with clean edges",
  () => {
    for (let i = 0; i < 5000; ++i) {
      graph.createEdge(i, i + 1);
    }
    graph.cleanEdges();
  },
  {
    onCycle: () => {},
  }
);

suite
  .on("cycle", (event) => {
    console.log(String(event.target));
  })
  // run async
  .run({ async: true });
